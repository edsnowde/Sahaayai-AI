from twilio.rest import Client

def send_sms():
    account_sid = "enter your key here" 
    auth_token = "enter your key here" 
    client = Client(account_sid, auth_token)

    message = client.messages.create(
        body="🚨 This is an emergency message sent using Twilio!",
        from_="+your number",        # Your Twilio phone number
        to="+your number"            # Your verified phone number
    )

    print(f"Message sent! SID: {message.sid}")

send_sms()
