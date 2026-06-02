from django.shortcuts import render ,redirect
from .models import Presentation, About, Service, Project , Technology, ProjectImage , Education , Experience  , ContactInfo
from .forms import ContactForm
from django.core.mail import send_mail
from django.conf import settings
from django.contrib import messages

def home(request):
    presentation = Presentation.objects.first()
    services = Service.objects.all()
    tech = Technology.objects.all()
    
    return render(
        request, 
        'portfolio/home.html', {
            'presentation': presentation,
            'services': services,
            'tech': tech
    })
    
def about(request):
    about_info = About.objects.first()
    experience = Experience.objects.all()
    education = Education.objects.all()
    
    return render(
        request, 
        'portfolio/about.html', {
            'about': about_info,
            'experience': experience,
            'education': education
        }
    )
    
def projects(request):
    all_projects = Project.objects.all()[:10]
    fetaured_projects = Project.objects.filter(featured=True)[:5]
    
    return render(
        request, 
        'portfolio/projects.html', {
            'projects': all_projects,
            'featured_projects': fetaured_projects
        }
    )

def skills(request):
    frontend_tech = Technology.objects.filter(category__name="Frontend")
    backend_tech = Technology.objects.filter(category__name="Backend")
    database_tech = Technology.objects.filter(category__name="Database")
    tool_tech = Technology.objects.filter(category__name="Tools")
    
    return render(
        request, 
        'portfolio/skills.html', {
            'frontend_tech': frontend_tech,
            'backend_tech': backend_tech,
            'database_tech': database_tech,
            'tool_tech': tool_tech
        }
    )
def contact(request):
    contact = ContactInfo.objects.first()
    
    if request.method == 'POST':
        form = ContactForm(request.POST)
        
        if form.is_valid():
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            subject = form.cleaned_data['subject']
            message = form.cleaned_data['message']
            
            full_message = f"From: {name} <{email}>\n\n{message}"
            
            send_mail(
                subject,
                full_message,
                settings.EMAIL_HOST_USER,
                ["rnandriaina11@gmail.com"],
                fail_silently=False,
            )
            
            messages.success(request, "Your message has been sent successfully!")
            return redirect('contact')
    else:
        form = ContactForm()
        
    return render(
        request, 
        'portfolio/contact.html', {
            'contact': contact,
            'form': form
        }
    )