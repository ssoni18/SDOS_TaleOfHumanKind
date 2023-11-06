# Generated by Django 4.2.7 on 2023-11-06 00:49

from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('email', models.EmailField(max_length=254, null=True)),
                ('date_of_birth', models.DateField(null=True)),
                ('qualification', models.CharField(max_length=100, null=True)),
                ('primary_phone_number', models.CharField(max_length=20, null=True)),
                ('secondary_phone_number', models.CharField(max_length=20, null=True)),
                ('user_type', models.CharField(max_length=50)),
                ('created_time', models.DateTimeField(null=True)),
                ('updated_time', models.DateTimeField(null=True)),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('country', models.CharField(max_length=100, null=True)),
                ('street_name', models.CharField(max_length=200, null=True)),
                ('state', models.CharField(max_length=100, null=True)),
                ('pincode', models.CharField(max_length=20, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Campaign',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, null=True)),
                ('description', models.TextField(null=True)),
                ('approved', models.BooleanField(null=True)),
                ('current_amount', models.DecimalField(decimal_places=2, max_digits=10, null=True)),
                ('goal_amount', models.DecimalField(decimal_places=2, max_digits=10, null=True)),
                ('category', models.CharField(max_length=100, null=True)),
                ('file_url', models.CharField(max_length=200, null=True)),
                ('created_date', models.DateTimeField(null=True)),
                ('updated_date', models.DateTimeField(null=True)),
                ('changemaker', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='created_campaigns', to=settings.AUTH_USER_MODEL)),
                ('leader', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='led_campaigns', to=settings.AUTH_USER_MODEL)),
                ('mentor', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='mentored_campaigns', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('payment_id', models.CharField(max_length=200, verbose_name='Payment ID')),
                ('order_id', models.CharField(max_length=200, verbose_name='Order ID')),
                ('signature', models.CharField(blank=True, max_length=500, null=True, verbose_name='Signature')),
                ('amount', models.IntegerField(verbose_name='Amount')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='SocialMediaHandle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('facebook_link', models.CharField(blank=True, max_length=200, null=True)),
                ('twitter_link', models.CharField(blank=True, max_length=200, null=True)),
                ('linkedin_link', models.CharField(blank=True, max_length=200, null=True)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='FeedItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('image', models.ImageField(upload_to='images/')),
                ('likes', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('resource_url', models.URLField(null=True)),
                ('creater', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='EducationalResource',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, null=True)),
                ('content_type', models.CharField(max_length=100, null=True)),
                ('resource_url', models.URLField(null=True)),
                ('created_date', models.DateTimeField(null=True)),
                ('updated_date', models.DateTimeField(null=True)),
                ('image', models.ImageField(null=True, upload_to='images/')),
                ('creator', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Donation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=100, null=True)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('receipt_id', models.CharField(blank=True, max_length=100, null=True)),
                ('created_at', models.DateTimeField(null=True)),
                ('campaign', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='dashboard.campaign')),
            ],
        ),
        migrations.CreateModel(
            name='CampaignChangemakers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('campaign', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='dashboard.campaign')),
                ('changemaker', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='customuser',
            name='address',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='users', to='dashboard.address'),
        ),
        migrations.AddField(
            model_name='customuser',
            name='groups',
            field=models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups'),
        ),
        migrations.AddField(
            model_name='customuser',
            name='social_handle',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='users', to='dashboard.socialmediahandle'),
        ),
        migrations.AddField(
            model_name='customuser',
            name='user_permissions',
            field=models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions'),
        ),
    ]
