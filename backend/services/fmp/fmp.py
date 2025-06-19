"""
Lambda function that retrieves earnings calendar data from Financial Modeling Prep (FMP) API
and stores it in DynamoDB. It uses AWS Systems Manager Parameter Store for configuration.
"""

import os
import json
from decimal import Decimal
from typing import List, Dict, Any
from datetime import datetime, timedelta
import requests
import boto3

# AWS Configuration - these can be defaults
AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")
PROJECT_NAME = os.environ.get("PROJECT_NAME", "earnings-sentiment")
ENVIRONMENT = os.environ.get("ENVIRONMENT", "dev")


# Always use Parameter Store (local and AWS)
def get_parameter(parameter_name: str) -> str:
    """Get parameter from AWS Systems Manager Parameter Store"""
    try:
        ssm = boto3.client("ssm", region_name=AWS_REGION)
        response = ssm.get_parameter(Name=parameter_name, WithDecryption=True)
        print(f"✅ Retrieved {parameter_name} from Parameter Store")
        return response["Parameter"]["Value"]
    except Exception as e:
        print(f"❌ Error getting parameter {parameter_name}: {e}")
        raise e


def lambda_handler(event, context):
    """Main Lambda handler - fetch earnings calendar and store in DynamoDB"""
    print(f"Starting earnings calendar data fetch in region: {AWS_REGION}")
    print(f"Request ID: {context.aws_request_id}")
    print(f"Event: {event}")

    try:
        # Always get config from Parameter Store
        print("Getting configuration from Parameter Store...")
        fmp_api_key = get_parameter(f"/{PROJECT_NAME}/{ENVIRONMENT}/fmp-api-key")
        table_name = get_parameter(
            f"/{PROJECT_NAME}/{ENVIRONMENT}/earnings-calendar-table"
        )

        print(f"Using table: {table_name}")

        # Initialize DynamoDB after getting config
        dynamodb = boto3.resource("dynamodb", region_name=AWS_REGION)

        # Fetch earnings calendar data from FMP
        earnings_data = get_earnings_calendar(fmp_api_key)
        print(f"Fetched {len(earnings_data)} earnings events")

        # Store in DynamoDB
        store_earnings_calendar(earnings_data, table_name, dynamodb)

        return {
            "statusCode": 200,
            "body": json.dumps(
                {
                    "message": f"Successfully stored {len(earnings_data)} earnings events",
                    "timestamp": datetime.now().isoformat(),
                }
            ),
        }

    except Exception as e:
        print(f"Error in lambda_handler: {e}")
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}


def get_earnings_calendar(api_key: str) -> List[Dict[str, Any]]:
    """Get earnings calendar data from Financial Modeling Prep API."""

    # Get date range (yesterday to 90 days ahead)
    yesterday = datetime.now() - timedelta(days=1)
    ninety_days_ahead = datetime.now() + timedelta(days=90)

    yesterday_str = yesterday.strftime("%Y-%m-%d")
    ninety_days_ahead_str = ninety_days_ahead.strftime("%Y-%m-%d")

    url = "https://financialmodelingprep.com/stable/earnings-calendar"
    params = {"from": yesterday_str, "to": ninety_days_ahead_str, "apikey": api_key}

    try:
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        earnings_data = response.json()

        print(f"Successfully fetched {len(earnings_data)} earnings events")
        return earnings_data

    except requests.exceptions.RequestException as e:
        print(f"Error fetching earnings calendar data: {e}")
        raise e


def store_earnings_calendar(
    earnings_data: List[Dict[str, Any]], table_name: str, dynamodb
):
    """Store earnings calendar data in DynamoDB."""

    table = dynamodb.Table(table_name)

    with table.batch_writer() as batch:
        for item in earnings_data:
            # Convert data to DynamoDB format
            now = datetime.now()
            dynamo_item = {
                "stock_symbol": item.get("symbol", ""),
                "earnings_date": item.get("date", ""),
                "eps_actual": convert_to_decimal(item.get("epsActual")),
                "eps_estimated": convert_to_decimal(item.get("epsEstimated")),
                "revenue_actual": convert_to_decimal(item.get("revenueActual")),
                "revenue_estimated": convert_to_decimal(item.get("revenueEstimated")),
                "last_updated": item.get("lastUpdated", ""),
                "created_at": now.isoformat(),
                "ttl": int((now + timedelta(days=365)).timestamp()),
            }

            try:
                batch.put_item(Item=dynamo_item)
            except Exception as e:
                print(f"Error storing item {item.get('symbol')}: {e}")

    print(f"Successfully stored {len(earnings_data)} items in DynamoDB")


def convert_to_decimal(value) -> Decimal:
    """Convert numeric values to Decimal for DynamoDB."""
    if value is None:
        return Decimal("0")
    try:
        return Decimal(str(value))
    except (ValueError, TypeError):
        return Decimal("0")
