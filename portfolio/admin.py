from django.contrib import admin

# Register your models here.
from .models import Presentation, About, Service, Project,TechnologyCategory,Technology,ProjectImage,Education , Experience,ContactInfo 
admin.site.register(Presentation)
admin.site.register(About)
admin.site.register(Service)
admin.site.register(Project)
admin.site.register(Technology)
admin.site.register(TechnologyCategory)
admin.site.register(ProjectImage)
admin.site.register(Education)
admin.site.register(Experience)
admin.site.register(ContactInfo)