from django.db import models
from django.core.exceptions import ValidationError
from django.utils.text import slugify

class SingletonModel(models.Model):
    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if not self.pk and self.__class__.objects.exists():
            raise ValidationError(
                f"Une seule instance de {self.__class__.__name__} est autorisée."
            )
        return super().save(*args, **kwargs)

# ==========================
# PRESENTATION
# ==========================

class Presentation(SingletonModel):
    title = models.CharField(max_length=150)
    subtitle = models.CharField(max_length=255)
    description = models.TextField()

    contact_url = models.CharField(max_length=255, blank=True)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)

    photo = models.ImageField(
        upload_to="presentation/",
        blank=True,
        null=True
    )

    def __str__(self):
        return "Présentation"


# ==========================
# ABOUT
# ==========================

class About(SingletonModel):
    title = models.CharField(max_length=150)

    description_1 = models.TextField()
    description_2 = models.TextField(blank=True)
    description_3 = models.TextField(blank=True)

    cv_url = models.URLField(blank=True)

    def __str__(self):
        return self.title


# ==========================
# SERVICES
# ==========================

class Service(models.Model):
    icon_class = models.CharField(max_length=100)

    service_name = models.CharField(max_length=150)

    description = models.TextField()

    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order"]

    def __str__(self):
        return self.service_name


# ==========================
# TECHNOLOGY CATEGORY
# ==========================

class TechnologyCategory(models.Model):
    name = models.CharField(
        max_length=50,
        unique=True
    )

    def __str__(self):
        return self.name


# ==========================
# TECHNOLOGIES
# ==========================

class Technology(models.Model):
    name = models.CharField(max_length=50)

    level = models.PositiveSmallIntegerField()

    category = models.ForeignKey(
        TechnologyCategory,
        on_delete=models.CASCADE,
        related_name="technologies"
    )

    icon_class = models.CharField(
        max_length=100,
        blank=True
    )

    display_order = models.PositiveIntegerField(
        default=0
    )

    class Meta:
        ordering = ["display_order"]

    def __str__(self):
        return self.name


# ==========================
# PROJECTS
# ==========================

class Project(models.Model):
    title = models.CharField(max_length=150)

    slug = models.SlugField(
        unique=True,
        blank=True
    )

    thumbnail = models.ImageField(
        upload_to="projects/thumbnails/",
        blank=True,
        null=True
    )

    description = models.TextField()

    github_url = models.URLField(blank=True)

    live_demo_url = models.URLField(blank=True)

    featured = models.BooleanField(default=False)

    technologies = models.ManyToManyField(
        Technology,
        related_name="projects",
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def save(self, *args, **kwargs):

        if not self.slug:
            self.slug = slugify(self.title)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


# ==========================
# PROJECT IMAGES
# ==========================

class ProjectImage(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="images"
    )

    image = models.ImageField(
        upload_to="projects/gallery/"
    )

    caption = models.CharField(
        max_length=255,
        blank=True
    )

    display_order = models.PositiveIntegerField(
        default=0
    )

    class Meta:
        ordering = ["display_order"]

    def __str__(self):
        return f"{self.project.title} - Image"


# ==========================
# EXPERIENCES
# ==========================

class Experience(models.Model):
    title = models.CharField(max_length=150)

    company = models.CharField(max_length=150)

    location = models.CharField(max_length=150)

    start_date = models.DateField()

    end_date = models.DateField(
        blank=True,
        null=True
    )

    description = models.TextField()

    current_position = models.BooleanField(
        default=False
    )

    class Meta:
        ordering = ["-start_date"]

    def __str__(self):
        return self.title


# ==========================
# EDUCATION
# ==========================

class Education(models.Model):
    school = models.CharField(max_length=150)

    diploma = models.CharField(max_length=150)

    start_date = models.DateField()

    end_date = models.DateField(
        blank=True,
        null=True
    )

    description = models.TextField(
        blank=True
    )

    class Meta:
        ordering = ["-start_date"]

    def __str__(self):
        return f"{self.diploma} - {self.school}"


# ==========================
# CONTACT INFO
# ==========================

class ContactInfo(SingletonModel):
    email = models.EmailField()

    phone = models.CharField(
        max_length=50,
        blank=True
    )

    address = models.CharField(
        max_length=255,
        blank=True
    )

    github_url = models.URLField(
        blank=True
    )

    linkedin_url = models.URLField(
        blank=True
    )

    facebook_url = models.URLField(
        blank=True
    )

    def __str__(self):
        return self.email