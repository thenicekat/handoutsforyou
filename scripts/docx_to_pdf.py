import subprocess
import pathlib
import os
from tqdm import tqdm
import logging

logging.basicConfig(
  level=logging.INFO,
  format="%(asctime)s [%(levelname)s] %(message)s",
  filemode="w",
  filename="docx_to_pdf.log"
)

SCRIPTS_DIR = pathlib.Path(__file__).parent
PUBLIC_DIR = SCRIPTS_DIR.parent / "public"
HANDOUTS_DIR = PUBLIC_DIR / "handouts"

success = 0
failed = 0

dirs = list(HANDOUTS_DIR.glob("*"))
logging.info(f"Found {len(dirs)} directories")

for dir in dirs:
  logging.info(f"Converting files in {dir}")
  docx_files = list(dir.glob("*.docx"))
  logging.info(f"Found {len(docx_files)} docx files")
  doc_files = list(dir.glob("*.doc"))
  logging.info(f"Found {len(doc_files)} doc files")
  
  for docx_file in tqdm(docx_files, desc="Converting docx files"):
    command = ["libreoffice", "--headless", "--convert-to", "pdf", docx_file, "--outdir", dir]
    success += 1 if subprocess.run(command).returncode == 0 else 0
    failed += 1 if subprocess.run(command).returncode != 0 else 0
    if subprocess.run(command).returncode == 0:
      os.remove(docx_file)
    else:
      logging.error(f"Failed to convert {docx_file}")
      
  for doc_file in tqdm(doc_files, desc="Converting doc files"):
    command = ["libreoffice", "--headless", "--convert-to", "pdf", doc_file, "--outdir", dir]
    success += 1 if subprocess.run(command).returncode == 0 else 0
    failed += 1 if subprocess.run(command).returncode != 0 else 0
    if subprocess.run(command).returncode == 0:
      os.remove(doc_file)
    else:
      logging.error(f"Failed to convert {doc_file}")
  
  logging.info(f"Finished converting files in {dir}")

logging.info(f"Success: {success}")
logging.info(f"Failed: {failed}")

