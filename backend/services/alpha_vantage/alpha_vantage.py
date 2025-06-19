"""
Functions to store earnings transcript data in DynamoDB and S3.
Handles the transcript response format from Alpha Vantage API.
"""

import os
import json
import uuid
from datetime import datetime, timedelta
import time
from typing import Dict, List, Any
from decimal import Decimal
import boto3
import requests


# Instantiate clients
def get_dynamodb_client(region_name: str = "us-east-1"):
    """Get DynamoDB resource client"""
    return boto3.resource("dynamodb", region_name=region_name)


def get_s3_client(region_name: str = "us-east-1"):
    """Get S3 client"""
    return boto3.client("s3", region_name=region_name)


# Convert numeric values to Decimal for DynamoDB
def convert_to_decimal(value) -> Decimal:
    """Convert numeric values to Decimal for DynamoDB."""
    if value is None:
        return Decimal("0")
    try:
        return Decimal(str(value))
    except (ValueError, TypeError):
        return Decimal("0")


# Generate unique transcript ID based on symbol and quarter
def generate_transcript_id(symbol: str, quarter: str) -> str:
    """Generate unique transcript ID"""
    return f"{symbol}_{quarter}_{uuid.uuid4().hex[:8]}"


# Store transcript data in both DynamoDB and S3
def store_transcript_dual_storage(
    transcript_response: Dict[str, Any],
    dynamodb_table_name: str,
    s3_bucket_name: str,
    region_name: str = "us-east-1",
) -> Dict[str, Any]:
    """
    Store transcript data in both DynamoDB (metadata) and S3 (full content).

    Args:
        transcript_response: Full API response from Alpha Vantage
        dynamodb_table_name: DynamoDB table name for metadata
        s3_bucket_name: S3 bucket name for full transcripts
        region_name: AWS region

    Returns:
        dict: Summary of storage results
    """
    # Initialize AWS clients
    dynamodb = get_dynamodb_client(region_name)
    s3_client = get_s3_client(region_name)

    table = dynamodb.Table(dynamodb_table_name)

    symbol = transcript_response.get("symbol", "")
    quarter = transcript_response.get("quarter", "")
    transcript_segments = transcript_response.get("transcript", [])

    if not transcript_segments:
        return {
            "success": False,
            "message": "No transcript segments found",
            "symbol": symbol,
            "quarter": quarter,
        }

    # Generate unique transcript ID for this earnings call
    transcript_id = generate_transcript_id(symbol, quarter)

    # S3 key structure: transcripts/{SYMBOL}/{QUARTER}/transcript.json
    s3_key = f"transcripts/{symbol}/{quarter}/transcript.json"

    # Current timestamp
    now = datetime.now()
    created_at = now.isoformat()

    # TTL - expire after 5 years (optional)
    ttl = int((now + timedelta(days=365 * 5)).timestamp())

    try:
        # 1. Store full transcript in S3
        s3_client.put_object(
            Bucket=s3_bucket_name,
            Key=s3_key,
            Body=json.dumps(transcript_response, indent=2),
            ContentType="application/json",
            Metadata={
                "symbol": symbol,
                "quarter": quarter,
                "transcript_id": transcript_id,
                "created_at": created_at,
            },
        )

        print(f"✅ Stored full transcript in S3: s3://{s3_bucket_name}/{s3_key}")

        # 2. Calculate metadata for DynamoDB
        total_segments = len(transcript_segments)
        total_words = sum(
            len(seg.get("content", "").split()) for seg in transcript_segments
        )

        # Calculate average sentiment
        sentiments = [
            float(seg.get("sentiment", 0))
            for seg in transcript_segments
            if seg.get("sentiment")
        ]
        avg_sentiment = sum(sentiments) / len(sentiments) if sentiments else 0

        # Extract unique speakers
        speakers = list(
            set(
                seg.get("speaker", "")
                for seg in transcript_segments
                if seg.get("speaker")
            )
        )

        # 3. Store metadata in DynamoDB
        metadata_item = {
            "transcript_id": transcript_id,
            "symbol": symbol,
            "quarter": quarter,
            "s3_bucket": s3_bucket_name,
            "s3_key": s3_key,
            "total_segments": total_segments,
            "total_words": total_words,
            "avg_sentiment": convert_to_decimal(avg_sentiment),
            "speakers": speakers,
            "speaker_count": len(speakers),
            "processed_for_training": False,
            "created_at": created_at,
            "ttl": ttl,
            "file_size_bytes": len(json.dumps(transcript_response)),
            "status": "stored",
        }

        table.put_item(Item=metadata_item)

        print(f"✅ Stored metadata in DynamoDB for {symbol} {quarter}")

        return {
            "success": True,
            "transcript_id": transcript_id,
            "symbol": symbol,
            "quarter": quarter,
            "s3_key": s3_key,
            "s3_bucket": s3_bucket_name,
            "total_segments": total_segments,
            "total_words": total_words,
            "avg_sentiment": float(avg_sentiment),
            "speakers": speakers,
            "created_at": created_at,
        }

    except Exception as e:
        print(f"❌ Error storing transcript for {symbol} {quarter}: {e}")
        return {"success": False, "error": str(e), "symbol": symbol, "quarter": quarter}


# Keep original function for backward compatibility
def store_transcript_data(
    transcript_response: Dict[str, Any], table_name: str, region_name: str = "us-east-1"
) -> Dict[str, Any]:
    """
    Store complete transcript data in DynamoDB (original function for compatibility).
    """
    dynamodb = get_dynamodb_client(region_name)
    table = dynamodb.Table(table_name)

    symbol = transcript_response.get("symbol", "")
    quarter = transcript_response.get("quarter", "")
    transcript_segments = transcript_response.get("transcript", [])

    if not transcript_segments:
        return {
            "success": False,
            "message": "No transcript segments found",
            "symbol": symbol,
            "quarter": quarter,
        }

    # Generate unique transcript ID for this earnings call
    transcript_id = generate_transcript_id(symbol, quarter)

    # Current timestamp
    now = datetime.now()
    created_at = now.isoformat()

    # TTL - expire after 5 years (optional)
    ttl = int((now + timedelta(days=365 * 5)).timestamp())

    stored_segments = []

    try:
        with table.batch_writer() as batch:
            for index, segment in enumerate(transcript_segments):
                # Create DynamoDB item for each transcript segment
                item = {
                    "transcript_id": transcript_id,
                    "segment_index": index,
                    "symbol": symbol,
                    "quarter": quarter,
                    "speaker": segment.get("speaker", ""),
                    "title": segment.get("title", ""),
                    "content": segment.get("content", ""),
                    "sentiment": convert_to_decimal(segment.get("sentiment", "0")),
                    "created_at": created_at,
                    "ttl": ttl,
                    "content_length": len(segment.get("content", "")),
                    "processing_status": "stored",
                }

                batch.put_item(Item=item)
                stored_segments.append(
                    {
                        "segment_index": index,
                        "speaker": segment.get("speaker", ""),
                        "content_length": len(segment.get("content", "")),
                    }
                )

        print(
            f"✅ Successfully stored {len(stored_segments)} segments for {symbol} {quarter}"
        )

        return {
            "success": True,
            "transcript_id": transcript_id,
            "symbol": symbol,
            "quarter": quarter,
            "segments_stored": len(stored_segments),
            "segments": stored_segments,
            "created_at": created_at,
        }

    except Exception as e:
        print(f"❌ Error storing transcript for {symbol} {quarter}: {e}")
        return {"success": False, "error": str(e), "symbol": symbol, "quarter": quarter}


def get_current_fiscal_quarter() -> str:
    """
    Get the current fiscal quarter based on today's date.
    Returns quarter in YYYYQX format.
    """
    now = datetime.now()
    year = now.year
    month = now.month

    # Determine quarter based on month
    if month <= 3:
        quarter = 1
    elif month <= 6:
        quarter = 2
    elif month <= 9:
        quarter = 3
    else:
        quarter = 4

    return f"{year}Q{quarter}"


def parse_fiscal_quarter(quarter_str: str) -> tuple:
    """
    Parse fiscal quarter string into year and quarter number.

    Args:
        quarter_str: Quarter in YYYYQX format (e.g., "2024Q1")

    Returns:
        tuple: (year, quarter_number)
    """
    if not quarter_str or "Q" not in quarter_str:
        raise ValueError(
            f"Invalid quarter format: {quarter_str}. Expected YYYYQX format."
        )

    year_str, quarter_str = quarter_str.split("Q")
    year = int(year_str)
    quarter = int(quarter_str)

    if not 1 <= quarter <= 4:
        raise ValueError(f"Quarter must be 1-4, got: {quarter}")

    return year, quarter


def generate_quarters_forward(start_quarter: str, end_quarter: str = None) -> List[str]:
    """
    Generate list of fiscal quarters from start_quarter to end_quarter (or current).

    Args:
        start_quarter: Starting quarter in YYYYQX format (e.g., "2024Q1")
        end_quarter: Ending quarter in YYYYQX format. If None, uses current quarter.

    Returns:
        List of quarters in YYYYQX format
    """
    if end_quarter is None:
        end_quarter = get_current_fiscal_quarter()

    start_year, start_q = parse_fiscal_quarter(start_quarter)
    end_year, end_q = parse_fiscal_quarter(end_quarter)

    quarters = []

    current_year = start_year
    current_quarter = start_q

    while True:
        quarter_str = f"{current_year}Q{current_quarter}"
        quarters.append(quarter_str)

        # Stop if we've reached the end quarter
        if current_year == end_year and current_quarter == end_q:
            break

        # Move to next quarter
        current_quarter += 1
        if current_quarter > 4:
            current_quarter = 1
            current_year += 1

        # Safety check to prevent infinite loops
        if current_year > end_year + 1:
            break

    return quarters


def fetch_earnings_transcript(
    symbol: str, quarter: str, api_key: str, retry_delay: float = 1.0
) -> dict:
    """
    Fetch earnings transcript for a specific symbol and quarter.

    Args:
        symbol: Stock symbol (e.g., "IBM")
        quarter: Fiscal quarter in YYYYQX format (e.g., "2024Q1")
        api_key: Alpha Vantage API key
        retry_delay: Delay between API calls to respect rate limits

    Returns:
        dict: API response data
    """
    url = "https://www.alphavantage.co/query"
    params = {
        "function": "EARNINGS_CALL_TRANSCRIPT",
        "symbol": symbol,
        "quarter": quarter,
        "apikey": api_key,
    }

    try:
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()

        # Add delay to respect API rate limits
        time.sleep(retry_delay)

        return response.json()

    except requests.exceptions.RequestException as e:
        print(f"Error fetching transcript for {symbol} {quarter}: {e}")
        return {}


def process_earnings_transcripts_with_dual_storage(
    symbol: str,
    start_quarter: str,
    api_key: str,
    dynamodb_table_name: str,
    s3_bucket_name: str,
    end_quarter: str = None,
    delay: float = 1.0,
    region_name: str = "us-east-1",
):
    """
    Process earnings transcripts and store them in both DynamoDB and S3.

    Args:
        symbol: Stock symbol to process
        start_quarter: Starting quarter in YYYYQX format
        api_key: Alpha Vantage API key
        dynamodb_table_name: DynamoDB table name for metadata
        s3_bucket_name: S3 bucket name for full transcripts
        end_quarter: Ending quarter (optional, defaults to current)
        delay: Delay between API calls
        region_name: AWS region

    Yields:
        dict: Results for each quarter processed including storage status
    """
    quarters = generate_quarters_forward(start_quarter, end_quarter)

    print(
        f"Processing {symbol} for {len(quarters)} quarters with dual storage: {start_quarter} to {end_quarter or get_current_fiscal_quarter()}"
    )

    for quarter in quarters:
        print(f"Fetching {symbol} {quarter}...")

        # Fetch transcript from API
        transcript_data = fetch_earnings_transcript(symbol, quarter, api_key, delay)

        api_success = bool(transcript_data and "transcript" in transcript_data)
        storage_result = None

        if api_success:
            print(f"✅ Successfully fetched {symbol} {quarter}")

            # Store in both DynamoDB and S3
            storage_result = store_transcript_dual_storage(
                transcript_data, dynamodb_table_name, s3_bucket_name, region_name
            )

        else:
            print(f"❌ No transcript found for {symbol} {quarter}")

        result = {
            "symbol": symbol,
            "quarter": quarter,
            "api_success": api_success,
            "storage_result": storage_result,
            "timestamp": datetime.now().isoformat(),
        }

        yield result


# Updated Lambda handler with dual storage
def lambda_handler(event, context):
    """
    Lambda function to process earnings transcripts and store in DynamoDB + S3.

    Expected event format:
    {
        "symbol": "IBM",
        "start_quarter": "2024Q1",
        "end_quarter": "2024Q4"  // optional
    }
    """
    print(f"Request ID: {context.aws_request_id}")
    print(f"Event: {event}")

    # Get configuration from Parameter Store
    PROJECT_NAME = os.environ.get("PROJECT_NAME", "earnings-sentiment")
    ENVIRONMENT = os.environ.get("ENVIRONMENT", "dev")
    AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")

    # Get configuration from Parameter Store
    def get_parameter(parameter_name: str) -> str:
        try:
            ssm = boto3.client("ssm", region_name=AWS_REGION)
            response = ssm.get_parameter(Name=parameter_name, WithDecryption=True)
            return response["Parameter"]["Value"]
        except Exception as e:
            print(f"Error getting parameter {parameter_name}: {e}")
            raise e

    try:
        # Get all required configuration
        api_key = get_parameter(f"/{PROJECT_NAME}/{ENVIRONMENT}/alpha-vantage-api-key")
        dynamodb_table_name = get_parameter(
            f"/{PROJECT_NAME}/{ENVIRONMENT}/earnings-transcripts-table"
        )
        s3_bucket_name = get_parameter(
            f"/{PROJECT_NAME}/{ENVIRONMENT}/earnings-data-bucket"
        )

        # Get event parameters
        symbol = event.get("symbol", "IBM")
        start_quarter = event.get("start_quarter", "2024Q1")
        end_quarter = event.get("end_quarter")  # None = current quarter

        print(f"Processing transcripts for {symbol} starting from {start_quarter}")
        print(f"Using S3 bucket: {s3_bucket_name}")
        print(f"Using DynamoDB table: {dynamodb_table_name}")

        # Process transcripts with dual storage
        results = []
        for result in process_earnings_transcripts_with_dual_storage(
            symbol=symbol,
            start_quarter=start_quarter,
            api_key=api_key,
            dynamodb_table_name=dynamodb_table_name,
            s3_bucket_name=s3_bucket_name,
            end_quarter=end_quarter,
            delay=1.0,
            region_name=AWS_REGION,
        ):
            results.append(
                {
                    "quarter": result["quarter"],
                    "api_success": result["api_success"],
                    "storage_success": (
                        result["storage_result"]["success"]
                        if result["storage_result"]
                        else False
                    ),
                    "s3_key": (
                        result["storage_result"]["s3_key"]
                        if result["storage_result"]
                        and result["storage_result"]["success"]
                        else None
                    ),
                    "total_segments": (
                        result["storage_result"]["total_segments"]
                        if result["storage_result"]
                        and result["storage_result"]["success"]
                        else 0
                    ),
                    "total_words": (
                        result["storage_result"]["total_words"]
                        if result["storage_result"]
                        and result["storage_result"]["success"]
                        else 0
                    ),
                }
            )

        successful_quarters = sum(
            1 for r in results if r["api_success"] and r["storage_success"]
        )
        total_segments = sum(r["total_segments"] for r in results)
        total_words = sum(r["total_words"] for r in results)

        return {
            "statusCode": 200,
            "body": json.dumps(
                {
                    "message": f"Successfully processed {successful_quarters}/{len(results)} quarters for {symbol}",
                    "symbol": symbol,
                    "quarters_processed": len(results),
                    "successful_quarters": successful_quarters,
                    "total_segments_stored": total_segments,
                    "total_words_processed": total_words,
                    "s3_bucket": s3_bucket_name,
                    "results": results,
                    "timestamp": datetime.now().isoformat(),
                }
            ),
        }

    except Exception as e:
        print(f"Error in lambda_handler: {e}")
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}


# Query functions for retrieving stored data
def get_transcript_by_symbol_quarter(
    symbol: str, quarter: str, table_name: str, region_name: str = "us-east-1"
) -> List[Dict]:
    """Query transcript segments by symbol and quarter"""
    dynamodb = get_dynamodb_client(region_name)
    table = dynamodb.Table(table_name)

    try:
        response = table.query(
            IndexName="symbol-quarter-index",
            KeyConditionExpression="symbol = :symbol AND quarter = :quarter",
            ExpressionAttributeValues={":symbol": symbol, ":quarter": quarter},
        )

        # Sort by segment_index
        segments = sorted(response["Items"], key=lambda x: int(x["segment_index"]))
        return segments

    except Exception as e:
        print(f"Error querying transcript for {symbol} {quarter}: {e}")
        return []


def get_all_transcripts_for_symbol(
    symbol: str, table_name: str, region_name: str = "us-east-1"
) -> Dict[str, List]:
    """Get all transcript quarters for a specific symbol"""
    dynamodb = get_dynamodb_client(region_name)
    table = dynamodb.Table(table_name)

    try:
        response = table.query(
            IndexName="symbol-quarter-index",
            KeyConditionExpression="symbol = :symbol",
            ExpressionAttributeValues={":symbol": symbol},
        )

        # Group by quarter
        quarters_data = {}
        for item in response["Items"]:
            quarter = item["quarter"]
            if quarter not in quarters_data:
                quarters_data[quarter] = []
            quarters_data[quarter].append(item)

        # Sort segments within each quarter
        for quarter in quarters_data:
            quarters_data[quarter] = sorted(
                quarters_data[quarter], key=lambda x: int(x["segment_index"])
            )

        return quarters_data

    except Exception as e:
        print(f"Error querying transcripts for {symbol}: {e}")
        return {}


def get_transcript_from_s3(
    symbol: str, quarter: str, s3_bucket_name: str, region_name: str = "us-east-1"
) -> Dict[str, Any]:
    """Retrieve full transcript from S3"""
    s3_client = get_s3_client(region_name)
    s3_key = f"transcripts/{symbol}/{quarter}/transcript.json"

    try:
        response = s3_client.get_object(Bucket=s3_bucket_name, Key=s3_key)
        transcript_data = json.loads(response["Body"].read())
        return transcript_data
    except Exception as e:
        print(f"Error retrieving transcript from S3 {s3_key}: {e}")
        return {}
