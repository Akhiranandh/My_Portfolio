from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings
from .forms import ContactMessageForm


def home(request):
    success = False
    form = ContactMessageForm()

    if request.method == "POST":
        form = ContactMessageForm(request.POST)

        if form.is_valid():
            contact = form.save()

            send_mail(
                subject=f"Portfolio Contact: {contact.subject}",
                message=(
                    f"Name: {contact.name}\n"
                    f"Email: {contact.email}\n\n"
                    f"Message:\n{contact.message}"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.CONTACT_EMAIL],
                fail_silently=False,
            )

            success = True
            form = ContactMessageForm()

    return render(request, "core/home.html", {
        "form": form,
        "success": success
    })