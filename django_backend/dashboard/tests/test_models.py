from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from dashboard.models import (
    CustomUser, Address, SocialMediaHandle, Campaign, 
    Donation, EducationalResource, FeedItem
)

class CustomUserModelTestCase(TestCase):
    def setUp(self):
        # Create a user for testing
        self.user = CustomUser.objects.create(username='testuser', email='test@example.com')
    
    def test_create_user(self):
        # Verify that a user is created successfully
        User = get_user_model()
        user = User.objects.create_user(email="normal@user.com", password="Password@12345")
        self.assertEqual(user.email, "normal@user.com")
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        try:
            self.assertIsNone(user.username)
        except AttributeError:
            pass
        with self.assertRaises(TypeError):
            User.objects.create_user()
        with self.assertRaises(TypeError):
            User.objects.create_user(email="")
        with self.assertRaises(ValueError):
            User.objects.create_user(email="", password="foo")

    def test_create_superuser(self):
        # Verify the creation of a superuser
        User = get_user_model()
        admin_user = User.objects.create_superuser(email="super@user.com", password="Password@12345")
        self.assertEqual(admin_user.email, "super@user.com")
        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
        try:
            self.assertIsNone(admin_user.username)
        except AttributeError:
            pass
        with self.assertRaises(ValueError):
            User.objects.create_superuser(email="super@user.com", password="foo", is_superuser=False)
    def test_create_user(self):
        # Verify that a user is created successfully
        self.assertEqual(CustomUser.objects.count(), 1)

    def test_update_user(self):
        # Update the user's first name and verify the change
        self.user.first_name = 'Updated'
        self.user.save()
        self.assertEqual(CustomUser.objects.get(pk=self.user.pk).first_name, 'Updated')

    def test_delete_user(self):
        # Delete the user and verify that there are no users in the database
        self.user.delete()
        self.assertEqual(CustomUser.objects.count(), 0)

    def test_user_address_association(self):
        # Create an address and associate it with the user
        address = Address.objects.create(country='Country', street_name='Street', state='State', pincode='12345')
        self.user.address = address
        self.user.save()
        # Verify that the user's address is correctly associated
        self.assertEqual(self.user.address, address)

    def test_user_social_media_handle_association(self):
        # Create a social media handle
        social_handle = SocialMediaHandle.objects.create(facebook_link='fb_link')

        # Assign the social handle to the user
        self.user.social_handle = social_handle
        self.user.save()

        # Retrieve the user again from the database to get the updated instance
        updated_user = CustomUser.objects.get(pk=self.user.pk)

        # Check if the social handle is associated correctly
        self.assertEqual(updated_user.social_handle, social_handle)
    

class AddressModelTestCase(TestCase):
    def test_create_address(self):
        # Create an address and verify that it is saved in the database
        address = Address.objects.create(country='Country', street_name='Street', state='State', pincode='12345')
        self.assertEqual(Address.objects.count(), 1)

    def test_update_address(self):
        # Create an address, update its state, and verify the change
        address = Address.objects.create(country='Country', street_name='Street', state='State', pincode='12345')
        address.state = 'Updated State'
        address.save()
        self.assertEqual(Address.objects.get(pk=address.pk).state, 'Updated State')

    def test_delete_address(self):
        # Create an address, delete it, and verify that there are no addresses in the database
        address = Address.objects.create(country='Country', street_name='Street', state='State', pincode='12345')
        address.delete()
        self.assertEqual(Address.objects.count(), 0)

class SocialMediaHandleModelTestCase(TestCase):
    def test_create_social_media_handle(self):
        # Create a social media handle and verify that it is saved in the database
        social_handle = SocialMediaHandle.objects.create(facebook_link='fb_link')
        self.assertEqual(SocialMediaHandle.objects.count(), 1)

    def test_update_social_media_handle(self):
        # Create a social media handle, update its Facebook link, and verify the change
        social_handle = SocialMediaHandle.objects.create(facebook_link='fb_link')
        social_handle.facebook_link = 'updated_fb_link'
        social_handle.save()
        self.assertEqual(SocialMediaHandle.objects.get(pk=social_handle.pk).facebook_link, 'updated_fb_link')

    def test_delete_social_media_handle(self):
        # Create a social media handle, delete it, and verify that there are no social media handles in the database
        social_handle = SocialMediaHandle.objects.create(facebook_link='fb_link')
        social_handle.delete()
        self.assertEqual(SocialMediaHandle.objects.count(), 0)


class CampaignModelTestCase(TestCase):
    def test_create_campaign(self):
        # Create a campaign and verify that it is saved in the database
        campaign = Campaign.objects.create(title='Campaign', description='Campaign description', isApproved=True)
        self.assertEqual(Campaign.objects.count(), 1)

    def test_update_campaign(self):
        # Create a campaign, update its title, and verify the change
        campaign = Campaign.objects.create(title='Campaign', description='Campaign description', isApproved=True)
        campaign.title = 'Updated Campaign'
        campaign.save()
        self.assertEqual(Campaign.objects.get(pk=campaign.pk).title, 'Updated Campaign')

    def test_delete_campaign(self):
        # Create a campaign, delete it, and verify that there are no campaigns in the database
        campaign = Campaign.objects.create(title='Campaign', description='Campaign description', isApproved=True)
        campaign.delete()
        self.assertEqual(Campaign.objects.count(), 0)

    def test_campaign_associations(self):
        # Create users for campaign associations
        mentor = CustomUser.objects.create(username='mentor', email='mentor@example.com')
        changemaker = CustomUser.objects.create(username='changemaker', email='changemaker@example.com')

        # Create a campaign with associations and verify them
        campaign = Campaign.objects.create(title='Campaign', description='Campaign description', isApproved=True,
                                          mentor=mentor, changemaker=changemaker)
        self.assertEqual(campaign.mentor, mentor)
        self.assertEqual(campaign.changemaker, changemaker)

class DonationModelTestCase(TestCase):
    def test_create_donation(self):
        # Create a campaign, create a donation associated with the campaign, and verify the donation is saved
        campaign = Campaign.objects.create(title='Campaign', description='Campaign description', isApproved=True)
        donation = Donation.objects.create(name='John Doe', email='john@example.com', campaign=campaign)
        self.assertEqual(Donation.objects.count(), 1)

    def test_update_donation(self):
        # Create a campaign, create a donation associated with the campaign, update the donation, and verify the update
        campaign = Campaign.objects.create(title='Campaign', description='Campaign description', isApproved=True)
        donation = Donation.objects.create(name='John Doe', email='john@example.com', campaign=campaign)
        donation.name = 'Updated Name'
        donation.save()
        self.assertEqual(Donation.objects.get(pk=donation.pk).name, 'Updated Name')

    def test_delete_donation(self):
        # Create a campaign, create a donation associated with the campaign, delete the donation, and verify no donations
        campaign = Campaign.objects.create(title='Campaign', description='Campaign description', isApproved=True)
        donation = Donation.objects.create(name='John Doe', email='john@example.com', campaign=campaign)
        donation.delete()
        self.assertEqual(Donation.objects.count(), 0)


class EducationalResourceModelTestCase(TestCase):
    def test_create_educational_resource(self):
        # Create a user (creator), create an educational resource, and verify it is saved in the database
        creator = CustomUser.objects.create(username='creator', email='creator@example.com')
        educational_resource = EducationalResource.objects.create(
            title='Resource', content_type='Article', resource_url='https://example.com/resource', creator=creator
        )
        self.assertEqual(EducationalResource.objects.count(), 1)

    def test_update_educational_resource(self):
        # Create a user (creator), create an educational resource, update its title, and verify the change
        creator = CustomUser.objects.create(username='creator', email='creator@example.com')
        educational_resource = EducationalResource.objects.create(
            title='Resource', content_type='Article', resource_url='https://example.com/resource', creator=creator
        )
        educational_resource.title = 'Updated Resource'
        educational_resource.save()
        self.assertEqual(EducationalResource.objects.get(pk=educational_resource.pk).title, 'Updated Resource')

    def test_delete_educational_resource(self):
        # Create a user (creator), create an educational resource, delete it, and verify there are no resources
        creator = CustomUser.objects.create(username='creator', email='creator@example.com')
        educational_resource = EducationalResource.objects.create(
            title='Resource', content_type='Article', resource_url='https://example.com/resource', creator=creator
        )
        educational_resource.delete()
        self.assertEqual(EducationalResource.objects.count(), 0)
class FeedItemModelTestCase(TestCase):
    def test_create_feed_item(self):
        # Create a user (creator), create a feed item, and verify it is saved in the database
        creator = CustomUser.objects.create(username='creator', email='creator@example.com')
        feed_item = FeedItem.objects.create(creater=creator, content='Test content')
        self.assertEqual(FeedItem.objects.count(), 1)

    def test_update_feed_item(self):
        # Create a user (creator), create a feed item, update its content, and verify the change
        creator = CustomUser.objects.create(username='creator', email='creator@example.com')
        feed_item = FeedItem.objects.create(creater=creator, content='Test content')
        feed_item.content = 'Updated content'
        feed_item.save()
        self.assertEqual(FeedItem.objects.get(pk=feed_item.pk).content, 'Updated content')

    def test_delete_feed_item(self):
        # Create a user (creator), create a feed item, delete it, and verify there are no feed items
        creator = CustomUser.objects.create(username='creator', email='creator@example.com')
        feed_item = FeedItem.objects.create(creater=creator, content='Test content')
        feed_item.delete()
        self.assertEqual(FeedItem.objects.count(), 0)



