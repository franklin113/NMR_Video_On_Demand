# NMR Video On Demand Library

## How to Install on a site

1) Clone or download this repo
2) Upload the file NMR_Video_On_Demand.js  OR  link directly to the most up-to-date version here:
https://firebasestorage.googleapis.com/v0/b/cgcaci21.appspot.com/o/video_on_demand%2Fvideo_on_demand.js?alt=media&token=41814f52-ffb9-4cfa-bd68-28e525e9dcd1
3) Create a single library page
4) Copy and paste NMR_Video_On_Demand.html  into the library page.
5) <i><strong>optional</strong></i>: Update the 'vod_firebase_config' firebase config. You probably don't need to do this.


## How to Get Data Into Firebase
1) Make a copy of this sheet - 
https://docs.google.com/spreadsheets/d/1z0Dx1k-TlMpTaNsWcLD7w2O9a14ie-Sdj7xuLF0ZeCk/edit?usp=sharing

2) Update the database url column in the "config" tab
3) <i><strong>optional</strong></i>: If you updated the vod_firebase_config in step 5, retrieve a database secret from firebase dashboard ( ask Tim or Brian A if you don't have access )
3) Add your data to the VOD_Template tab following the template as a guide.


## How to add Resources Under a video?
1) Using the sheet created in the above step, check out the "Resources Template" tab.  The resources listed here are merged into the VOD_Template tab.


## How to manage permissions
This VOD system allows for video level permission control.
By default, everyone sees everything.  
