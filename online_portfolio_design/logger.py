"""
This module configures and provides a logger instance for the application.

It sets up basic logging to a file, specifying the log level, format, and date format.
The logger instance can be imported and used in other modules to log messages.

Logging is essential for tracking application behavior, debugging issues, and monitoring
performance in production environments.
"""

import logging  # Import the logging module for creating and managing log messages

# Configure logging
logging.basicConfig(
    filename="app.log",  # Log file name: where log messages will be stored.  All logs for the application will be written to this file.
    level=logging.INFO,  # Log level: INFO, WARNING, ERROR, CRITICAL (and DEBUG, if needed). Controls which messages are recorded.  Only messages with a level of INFO or higher will be logged.
    format="%(asctime)s - %(levelname)s - %(module)s - %(funcName)s - %(message)s",
    # Log format: Includes timestamp, level, message, module, and function name.
    # Defines the structure of each log message, including the timestamp, log level, module name, function name, and the actual log message.
    datefmt="%Y-%m-%d %H:%M:%S",
    # Date format: Defines the format of the timestamp in the log messages.
    # Specifies the format for the date and time in the log messages (Year-Month-Day Hour:Minute:Second).
)

# Create a logger instance for this module
logger = logging.getLogger(
    __name__
)  # Use this in other files to log messages.  Creates a logger specific to the current module, which is best practice.


console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)
