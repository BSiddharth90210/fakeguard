FROM python:3.10-slim

WORKDIR /code

# Install requirements
COPY ./requirements-hf.txt /code/requirements.txt
# Using CPU version of PyTorch for Hugging Face free tier
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu

# Set up a new user named "user" with user ID 1000
RUN useradd -m -u 1000 user

# Switch to the "user" user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

# Copy all files (including models) to the container
COPY --chown=user . $HOME/app

# Hugging Face Spaces require the app to run on port 7860
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
