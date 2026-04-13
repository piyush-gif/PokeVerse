# Use a slim version of Python to keep the image size small
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Install system dependencies needed for some Python packages
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your backend code
COPY . .

# Start FastAPI using uvicorn
# Note: Ensure your main file is 'main.py' and your FastAPI instance is 'app'
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]