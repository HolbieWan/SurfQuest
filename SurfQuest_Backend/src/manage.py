# #!/usr/bin/env python
# """Django's command-line utility for administrative tasks."""
# import os
# import sys


# def main():
#     """Run administrative tasks."""
#     os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'surfquest.settings')
#     try:
#         from django.core.management import execute_from_command_line
#     except ImportError as exc:
#         raise ImportError(
#             "Couldn't import Django. Are you sure it's installed and "
#             "available on your PYTHONPATH environment variable? Did you "
#             "forget to activate a virtual environment?"
#         ) from exc
#     execute_from_command_line(sys.argv)


# if __name__ == '__main__':
#     main()

#!/usr/bin/env python
import os
import sys
sys.path.append('/app')

if __name__ == '__main__':
    # Dynamically set the settings module based on the environment
    environment = os.getenv('DJANGO_ENV', 'dev')
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', f'surfquest.settings.{environment}')

    print("PYTHONPATH:", sys.path)
    print("DJANGO_SETTINGS_MODULE:", os.getenv('DJANGO_SETTINGS_MODULE'))

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    execute_from_command_line(sys.argv)