#!/usr/bin/python3

import subprocess
import pathlib
import os
from tqdm import tqdm
import logging

logging.basicConfig(
  level=logging.INFO,
  format="%(asctime)s [%(levelname)s] %(message)s",
  filemode="w",
  filename="filetype_conversion.log"
)

def convert_files(input_files: list[str], output_dir: str, file_type: str) -> tuple[int, int]:
  failed = success = 0
  for input_file in tqdm(input_files, desc=f"Converting {file_type} files"):
    command = ["libreoffice", "--headless", "--convert-to", "pdf", input_file, "--outdir", output_dir]
    if subprocess.run(command).returncode:
      failed += 1
    else:
      success += 1
    
    if subprocess.run(command).returncode:
      logging.error(f"Failed to convert {input_file}")
    else:
      os.remove(input_file)

  return (success, failed)

if __name__ == "__main__":
  SCRIPTS_DIR = pathlib.Path(__file__).parent
  PUBLIC_DIR = SCRIPTS_DIR.parent / "public"
  HANDOUTS_DIR = PUBLIC_DIR / "handouts"
  
  success = failed = 0
  
  dirs = list(HANDOUTS_DIR.glob("*"))
  logging.info(f"Found {len(dirs)} directories")
  
  for dir in dirs:
    logging.info(f"Converting files in {dir}")
    docx_files = list(dir.glob("*.docx"))
    logging.info(f"Found {len(docx_files)} docx files")
    doc_files = list(dir.glob("*.doc"))
    logging.info(f"Found {len(doc_files)} doc files")
  
    score = convert_files(docx_files, dir, "docx")
    success += score[0]
    failed += score[1]
  
    score = convert_files(doc_files, dir, "doc")
    success += score[0]
    failed += score[1]
    
    logging.info(f"Finished converting files in {dir}")
  
  logging.info(f"Success: {success}")
  logging.info(f"Failed: {failed}")
  
