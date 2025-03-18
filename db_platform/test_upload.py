import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'db_platform.settings')
import django
django.setup()
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

try:
    file_content = ContentFile(b"Test file content")
    file_path = default_storage.save('test/test_file.txt', file_content)
    logger.debug(f"Fichier sauvegardé à : {file_path}")
    url = default_storage.url(file_path)
    logger.debug(f"URL du fichier : {url}")
except Exception as e:
    logger.error(f"Erreur lors de l'upload : {e}")