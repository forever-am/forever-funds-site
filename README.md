### This is small tutorial on what all folders represent so anyone can walk through and find/update data that they need.

## - _data
-   It has 2 folders inside:

        blog
        index

- blog: It contains authors.yml which is just names and info about authors that can be used for blog page
    -   Blog images should be **640 x 360** px. If you want adjustments with random size images, please contact developer for it
    -   For image path (in _posts/*.md), use absolute url with starting **/** ex: /assets/images/blog/my-blog-post-featured-image.png
- index: All files with json data for index (home) page. It is divided by sections and names for easier understanding

## - _members
-   It contains *.md files from all members of CRC. They are directly injected in About Us page (first members with cat - category of portfolio, than other ones)
-   For easier usage, copy/paste existing file from member and edit it *PS: Don't forget to add proper image (size should be around **202x202** px with black background and round border so it fits current design)

## - _posts
-   It contains posts, They need to be written and named in specific format, so please, read documentation online about _posts in jekyll

## - _sass
-   It contains all styles for website. Styles for all sections are in folder called **_components**, divided by _blog, _sections and atom reusable component styles that are used all around website. Entire css file is less than 1400 lines of code, with full support of all cross browser, mobile responsive and fallback for old browsers

## pages
-   It contains all *.md files for pages. Custom small data on pages (like titles, colors, descriptions etc...) can be edited in them.

# - BUILD COMMAND -
-   Please use command **`JEKYLL_ENV=production jekyll build`** so built version in _site has google analytics enabled.
-   NOTE: ** Please, add tracking id in _config.yml in google_analytics_tracking_id

##### If any problem occures with site, or data displaying, please don't hesitate to contact me.
##### For any additional questions or problems, please contact me at *bkrsmanovic480@gmail.com*
#### Have Fun!