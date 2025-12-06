# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Selfie PullAI seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please do NOT:

- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before it's been addressed

### Please DO:

1. **Email us** at [security@example.com] with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any suggested fixes (optional)

2. **Allow time** for us to respond (typically within 48 hours)

3. **Work with us** to understand and resolve the issue

## Security Considerations

### API Key Storage

- API keys are stored in the browser's `localStorage`
- Keys are never transmitted to any server other than Google's API
- Users should not share their API keys

### Data Privacy

- All image processing happens client-side
- No images are uploaded to our servers
- History is stored locally in IndexedDB

### Third-Party Services

- The only external API call is to Google Gemini
- HTTPS is used for all API communications

## Best Practices for Users

1. **Keep your API key private** - Don't share it or commit it to version control
2. **Use HTTPS** - When deploying, always use HTTPS
3. **Clear history** - Regularly clear your local history if desired
4. **Report issues** - If you see suspicious behavior, let us know

## Acknowledgments

We appreciate the security research community's efforts in helping keep our users safe.
