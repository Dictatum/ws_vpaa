# VPAA Event Coordination System - Django Backend

## Setup

1. Create virtual environment:
\`\`\`bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
\`\`\`

2. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

3. Configure environment variables:
\`\`\`bash
cp .env.example .env
# Edit .env with your settings
\`\`\`

4. Run migrations:
\`\`\`bash
python manage.py migrate
\`\`\`

5. Create superuser:
\`\`\`bash
python manage.py createsuperuser
\`\`\`

6. Run development server:
\`\`\`bash
python manage.py runserver
\`\`\`

## API Endpoints

- `POST /api/users/register/` - Register new user
- `POST /api/auth/token/` - Get JWT token
- `GET/POST /api/events/` - List/create events
- `GET/POST /api/attendees/` - List/create attendees
- `POST /api/attendees/check_in/` - Check in attendee
- `GET/POST /api/certificates/` - List/create certificates

## Docs

- API Documentation: http://localhost:8000/api/docs/
- Admin: http://localhost:8000/admin/
\`\`\`
