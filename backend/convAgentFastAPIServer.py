import os
import re
import json
import requests
from datetime import datetime
from typing import Optional, List, Union, Dict

# --- Third-party imports
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# === FastAPI App ===
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust origins in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

