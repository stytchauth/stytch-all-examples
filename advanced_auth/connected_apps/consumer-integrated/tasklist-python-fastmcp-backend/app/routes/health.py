from fastapi import APIRouter
import os

router = APIRouter()

@router.get('/healthcheck')
def healthcheck():
    errors = []
    if not os.environ.get('STYTCH_PROJECT_ID'):
        errors.append({
            'variable': 'STYTCH_PROJECT_ID',
            'description': 'Your Stytch project ID (e.g., project-test-...)'
        })
    if not os.environ.get('STYTCH_PROJECT_SECRET'):
        errors.append({
            'variable': 'STYTCH_PROJECT_SECRET',
            'description': 'Your Stytch secret key from Project Settings'
        })

    if not os.environ.get('STYTCH_DOMAIN'):
        errors.append({
            'variable': 'STYTCH_DOMAIN',
            'description': 'Your Stytch domain (e.g., https://test.stytch.com)'
        })

    if errors:
        return {
            'status': 'error',
            'errors': errors,
            'message': 'Backend configuration is incomplete. Add missing variables to .env.local file.',
            'configFile': '.env.local'
        }

    return {'status': 'ok', 'message': 'All environment variables are configured correctly'}
