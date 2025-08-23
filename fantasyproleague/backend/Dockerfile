# Use Python 3.12
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy code and install dependencies
COPY . ./
RUN pip install --no-cache-dir -r requirements.txt

# Expose port for FastAPI
EXPOSE 8000

# Run app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
