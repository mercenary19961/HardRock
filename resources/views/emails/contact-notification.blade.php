<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
        .content {
            background: #f9fafb;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .info-row {
            margin-bottom: 15px;
        }
        .label {
            font-weight: bold;
            color: #6B7280;
            display: inline-block;
            width: 150px;
        }
        .value {
            color: #111827;
        }
        .services {
            background: white;
            padding: 15px;
            border-radius: 6px;
            margin-top: 10px;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            color: #6B7280;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="margin: 0;">New Contact Form Submission</h1>
        <p style="margin: 5px 0 0 0;">HardRock Agency</p>
    </div>

    <div class="content">
        <p>You have received a new contact form submission from your website:</p>

        <div class="info-row">
            <span class="label">Name:</span>
            <span class="value">{{ $contact->personal_name }}</span>
        </div>

        @if($contact->company_name)
        <div class="info-row">
            <span class="label">Company:</span>
            <span class="value">{{ $contact->company_name }}</span>
        </div>
        @endif

        <div class="info-row">
            <span class="label">Email:</span>
            <span class="value"><a href="mailto:{{ $contact->email }}">{{ $contact->email }}</a></span>
        </div>

        <div class="info-row">
            <span class="label">Phone:</span>
            <span class="value"><a href="tel:{{ $contact->phone_number }}">{{ $contact->phone_number }}</a></span>
        </div>

        @if($contact->services && count($contact->services) > 0)
        <div class="info-row">
            <span class="label">Interested Services:</span>
            <div class="services">
                <ul style="margin: 0; padding-left: 20px;">
                    @foreach($contact->services as $service)
                    <li>{{ $service }}</li>
                    @endforeach
                </ul>
            </div>
        </div>
        @endif

        @if($contact->more_details)
        <div class="info-row">
            <span class="label">Additional Details:</span>
            <div class="services">
                <p style="margin: 0;">{{ $contact->more_details }}</p>
            </div>
        </div>
        @endif

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="margin: 0; color: #6B7280; font-size: 14px;">
                Submitted on: {{ $contact->created_at->format('F j, Y \a\t g:i A') }}
            </p>
        </div>
    </div>

    <div class="footer">
        <p>This email was sent from your HardRock website contact form.</p>
    </div>
</body>
</html>
