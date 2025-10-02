import os
from typing import Optional, Dict, Any
from dotenv import load_dotenv
from stytch import B2BClient

# Load local environment for backend (project ID/secret, etc.)
load_dotenv(".env.local")

class StytchClient:
    def __init__(self):
        self.project_id = os.getenv("STYTCH_PROJECT_ID")
        self.secret = os.getenv("STYTCH_SECRET")
        self.domain = os.getenv("STYTCH_DOMAIN")

        if not self.project_id or not self.secret:
            raise ValueError("STYTCH_PROJECT_ID and STYTCH_SECRET must be set")

        # Initialize official SDK client
        self.client = B2BClient(
            project_id=self.project_id,
            secret=self.secret,
            environment="test",
            custom_base_url=self.domain,
        )

    async def verify_session(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify a Stytch B2B session (JWT or opaque token) using the official SDK."""
        try:
            is_jwt = token.count(".") == 2
            if is_jwt:
                resp = self.client.sessions.authenticate_jwt(session_jwt=token)
            else:
                resp = self.client.sessions.authenticate(session_token=token)

            # Extract from B2B response shape
            member_session = getattr(resp, "member_session", None)
            member_id = getattr(member_session, "member_id", None) if member_session else None
            organization_id = getattr(resp, "organization_id", None)
            if not organization_id and member_session:
                organization_id = getattr(member_session, "organization_id", None)
            session_id = getattr(member_session, "member_session_id", None) if member_session else None

            return {
                "member_id": member_id,
                "organization_id": organization_id,
                "session_id": session_id,
            }
        except Exception as e:
            print(f"Error verifying Stytch session: {e}")
            return None

# Global client instance
stytch_client = StytchClient()
