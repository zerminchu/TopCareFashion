# Generated by Django 4.2.3 on 2023-09-10 09:01

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(max_length=255)),
                ('condition', models.CharField(max_length=255)),
                ('colour', models.CharField(max_length=255)),
                ('title', models.CharField(max_length=255)),
                ('price', models.CharField(max_length=255)),
                ('image_urls', models.JSONField(default=list)),
            ],
        ),
        migrations.CreateModel(
            name='Listing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('avail_status', models.CharField(max_length=255)),
                ('quantity_available', models.CharField(max_length=255)),
                ('collection_address', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.CharField(default='', max_length=100, unique=True)),
                ('first_name', models.CharField(blank=True, max_length=100)),
                ('last_name', models.CharField(blank=True, max_length=100)),
                ('email', models.EmailField(blank=True, max_length=254, unique=True)),
                ('date_of_birth', models.DateTimeField()),
                ('role', models.CharField(choices=[('buyer', 'buyer'), ('seller', 'seller'), ('admin', 'admin')], max_length=10)),
                ('profile_image', models.URLField(blank=True, null=True)),
                ('gender', models.CharField(blank=True, choices=[('male', 'male'), ('female', 'female')], max_length=10)),
                ('phone_number', models.CharField(blank=True, max_length=20, null=True)),
                ('color', models.CharField(blank=True, max_length=50, null=True)),
                ('size', models.CharField(blank=True, max_length=20, null=True)),
                ('type', models.CharField(blank=True, max_length=50, null=True)),
                ('stripe_id', models.CharField(blank=True, max_length=100, null=True)),
                ('business_name', models.CharField(blank=True, max_length=100, null=True)),
                ('business_type', models.CharField(blank=True, max_length=50, null=True)),
                ('location', models.CharField(blank=True, max_length=200, null=True)),
                ('contact_info', models.CharField(blank=True, max_length=200, null=True)),
                ('social_media_link', models.URLField(blank=True, null=True)),
            ],
        ),
    ]
