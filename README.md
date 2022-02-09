# NMR Video On Demand Library

## How to Install on a site

1. Clone or download this repo
2. Upload the file NMR_Video_On_Demand.js OR link directly to the most up-to-date version here:
   https://firebasestorage.googleapis.com/v0/b/cgcaci21.appspot.com/o/video_on_demand%2Fvideo_on_demand.js?alt=media&token=41814f52-ffb9-4cfa-bd68-28e525e9dcd1
3. Create a single library page
4. Copy and paste NMR_Video_On_Demand.html into the library page.
5. <i><strong>optional</strong></i>: Update the 'vod_firebase_config' firebase config. You probably don't need to do this.

## How to Get Data Into Firebase

1. Make a copy of this sheet -
   https://docs.google.com/spreadsheets/d/1z0Dx1k-TlMpTaNsWcLD7w2O9a14ie-Sdj7xuLF0ZeCk/edit?usp=sharing

2. Update the database url column in the "config" tab
3. <i><strong>optional</strong></i>: If you updated the vod_firebase_config in step 5, retrieve a database secret from firebase dashboard ( ask Tim or Brian A if you don't have access )
4. Add your data to the VOD_Template tab following the template as a guide.

## How to manage videos

To add a new video, create a new row, provide a unique ID, a category, and the video_url.
Minimum Required Fields:
| id | thumb_with_play_button | category | video_url |
| -- | --- | --- | -- |
|1|url to thumbnail image| category this video is part of| url to video|

## How to manage permissions

This VOD system allows for video level permission control.
By default, everyone sees everything. To give access to everyone, leave the permissions column empty.

In the html page page, there is a object called "vod_user_data". This contains information about the user. They key attribute here is "user_type". Whatever you put here provides access control to video content.

For example, the below configuration would assign the current user to admin. The only videos the user would see are videos assigned the "admin" permission OR a blank cell in the permissions colummn.

    const vod_user_data = {
        ...
        user_type: "admin"
    };

To configure a video for admin access, go to your google sheet and add the admin value like so:
| id | permissions | category |
| -- | ---------| --- |
| 0 | admin | cat1 |

Now, this user should have access to the video.

This is great and all, but how do we provide access to multiple user types?
Below is an example of multiple user types for a single video.

    // NMR_Video_On_Demand.html
    const vod_user_data = {
        ...
        user_type: [[user_role]] // admin | guest | vip
    };

| id  | permissions       | category |
| --- | ----------------- | -------- |
| 0   | admin, guest, vip | cat1     |

## How to add Resources Under a video?

1. Using the sheet created in the above step, check out the "Resources Template" tab. The resources listed here are merged into the VOD_Template tab.

# Video Item API

## id

A unique value for this video. Ideally, this is either the agenda ID or the vimeo ID because we can use it in lookups later.

## private_url

Depricated, not used but found in some sheets

## thumbnail

Depricated, not used but found in some sheets

## thumb_with_play_button

Link to thumbnail image

## external_url

Depricated, not used but found in some sheets

## title

The title displayed on the VOD card element

## description

The video description found on both the card and the video player page.

## idx

The sort order <i>within</i> the category it lives in.

## permissions
### comma seperated list
A comma seperated list of user access this video has. If left empty, everyone has access. If filled with a value, an exact match is used on the "user_type" data attribute.
For example,
if permissions includes 'admin' a user_type of 'admin' is matched.

## category
### string
The category or section this video gets put into. You can create groups of videos by creating categories.

## video_url
### string
The direct url to the vimeo video.

## open_in_new_tab
### boolean
If enabled, clicking the video will open the link in a new tab. This essentially turns the link into an atag like so:

    
    <a href=video_url target="_Blank">
    ...
    </a>

## resources
### object
todo



# VOD Config API
## id	
Must always be 'vod_library_config'
## footer_text	
### string
## modal_player	
### boolean
Shows either a modal player or new page
## desc_show_more_text	
### string
default: 'Show More'
## desc_show_less_text	
### string
default: 'Show Less'
## desc_truncate_length	
### number
the length at which the description will begin to be truncated.
## thumbnail_tag
### html tag name	
default: 'img'
common options: 'img' | 'div' | 'section'
Whatever element type is here is provided

## categories
The categories approach is slightly complicated, so bear with me here. A new category contains both an ID and a title. It's easier to think about it like we'll
be doing dot notation to select it in javascript.
categories is an object with the category index as it's members. Each category entry 
    
    // a categories object
    {
        0 : {
            id : 12,
            title : "My Category"
        },
        1 : {
            id : 13,
            title : "Second Category"
        }
    }

    // javascript access 

    // category 1
    categories.0.id	
    categories.0.title	

    // category 2
    categories.1.id	
    categories.1.title		

On the sheets side, this is how you'd enter it.
|categories.0.id|categories.0.title|categories.1.id|categories.1.title |
|-|-|-|-|
|12|My Category|13|Second Category|			


# Standalone Player Page Query Parameter API

## video_url
The full url to the video, encoded

## vimeo_id
The id of the vimeo video. Must work with this:
"https://player.vimeo.com/video/{{vimeo_id}}

## id
Selects an item from the built in VOD list



