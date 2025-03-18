# test_minio.py dans db_platform/
import boto3
from botocore.client import Config

s3 = boto3.client(
    's3',
    endpoint_url='http://127.0.0.1:9000',
    aws_access_key_id='minioadmin',
    aws_secret_access_key='minioadmin',
    config=Config(signature_version='s3v4', region_name='us-east-1'),
)

try:
    response = s3.list_buckets()
    print("Buckets:", response['Buckets'])
except Exception as e:
    print("Erreur:", e)