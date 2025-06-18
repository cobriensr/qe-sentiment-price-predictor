"""
Simple Lambda function to fetch earnings calendar data and store in DynamoDB.
Runs nightly to keep earnings calendar up to date.
"""

import os
import json
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from decimal import Decimal
import boto3
import requests


def get_parameter_value(parameter_name: str, region: str) -> Optional[str]:
    """Get parameter from AWS Systems Manager Parameter Store"""
    try:
        ssm = boto3.client("ssm", region_name=region)
        response = ssm.get_parameter(Name=parameter_name, WithDecryption=True)
        return response["Parameter"]["Value"]
    except Exception as e:
        print(f"Could not retrieve parameter {parameter_name}: {e}")
        return None


def get_config_value(env_var_name: str, fallback_parameter_path: str = None) -> str:
    """Get value from environment variable or fallback to Parameter Store"""
    # Try environment variable first (this will work in production)
    value = os.environ.get(env_var_name)

    if value:
        return value

    # Fallback to Parameter Store (for local testing)
    if fallback_parameter_path:
        print(
            f"Environment variable {env_var_name} not found, checking Parameter Store..."
        )
        aws_region = os.environ.get("AWS_REGION", "us-east-1")
        value = get_parameter_value(fallback_parameter_path, aws_region)

        if value:
            print(f"Retrieved {env_var_name} from Parameter Store")
            return value

    raise ValueError(
        f"Could not find {env_var_name} in environment variables or Parameter Store"
    )


# Get configuration values
PROJECT_NAME = os.environ.get("PROJECT_NAME", "qe-sentiment-price-predictor")
ENVIRONMENT = os.environ.get("ENVIRONMENT", "dev")
AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")

# Get API key and table name with Parameter Store fallback
FMP_API_KEY = get_config_value(
    "FMP_API_KEY", f"/{PROJECT_NAME}/{ENVIRONMENT}/fmp-api-key"
)

EARNINGS_CALENDAR_TABLE = get_config_value(
    "EARNINGS_CALENDAR_TABLE", f"/{PROJECT_NAME}/{ENVIRONMENT}/earnings-calendar-table"
)

# AWS clients
dynamodb = boto3.resource("dynamodb", region_name=AWS_REGION)


def lambda_handler(event, context):
    """Main Lambda handler - fetch earnings calendar and store in DynamoDB"""
    print("Starting earnings calendar data fetch...")

    try:
        # 1. Fetch earnings calendar data from FMP
        earnings_data = get_earnings_calendar()
        print(f"Fetched {len(earnings_data)} earnings events")

        # 2. Store in DynamoDB
        store_earnings_calendar(earnings_data)

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


def get_earnings_calendar() -> List[Dict[str, Any]]:
    """Get earnings calendar data from Financial Modeling Prep API."""

    # Get date range (yesterday to 90 days ahead)
    yesterday = datetime.now() - timedelta(days=1)
    ninety_days_ahead = datetime.now() + timedelta(days=90)

    yesterday_str = yesterday.strftime("%Y-%m-%d")
    ninety_days_ahead_str = ninety_days_ahead.strftime("%Y-%m-%d")

    url = "https://financialmodelingprep.com/stable/earnings-calendar"
    params = {"from": yesterday_str, "to": ninety_days_ahead_str, "apikey": FMP_API_KEY}

    try:
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        earnings_data = response.json()

        print(f"Successfully fetched {len(earnings_data)} earnings events")
        return earnings_data

    except requests.exceptions.RequestException as e:
        print(f"Error fetching earnings calendar data: {e}")
        raise e


def store_earnings_calendar(earnings_data: List[Dict[str, Any]]):
    """Store earnings calendar data in DynamoDB."""

    table = dynamodb.Table(EARNINGS_CALENDAR_TABLE)

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
