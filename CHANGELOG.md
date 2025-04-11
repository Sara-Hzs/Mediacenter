# Changes made between 24.03 and 11.04

## 1. File Path Changes
- In `package.json`, the destination path for files has been updated from `./public/googleDriveFiles` to `./public/files`
- File references throughout the application were updated to match this new path structure

## 2. New Categories
Three new categories were added to `public/categories.json`:
- **COPPER** with icon at `icons/copper.png`
- **INFOBASE** with icon at `icons/infobase.png`
- **ZENIQ Ecosystem** – no icon for it yet

## 4. Version Update
- Updated WebOn version from `0.1.6` to `0.1.16`

## 5. UI Improvements
- Icon style changes: Added rounded corners to category icons 
- Adjusted file card height for a more compact layout
- Improved spacing in grid layouts 


## 6. Language Handling Enhancements
- Added proper language detection using `nomo.getLanguage()`
- Default language now set to user’s Default language in the Nomo app (was previously hardcoded to `'en'`)
- Added **"All Languages"** option in the language selector
- Language falgs now appear next to file names under "All Languages"
- Empty categories are now hidden when no files match the selected language

## 7. URL Parameter Support
- Added support for direct file linking via URL hash parameter
- Implemented auto-scrolling to matched files via hash
- Categories containing matched files auto-expand on load

## 8. File Type Handling
- Added support for `.link` files that open external URLs
- Improved detection and handling of file types
- Icons now display for `.link` file types

## 9. File Interaction
- Updated interaction model to open files in external apps via `nomo.launchUrl`
- All file types are now clickable (previously only images and videos were)
- Improved truncation of long filenames based on screen size

## 10. Responsive Design Improvements
- Implemented mobile vs desktop detection to improve layout responsiveness
- Enhanced overflow and truncation logic for small-screen compatibility

---

## Summary of Major Changes
1. **File Path Restructure**: Moved files to new `/files` directory  
2. **New Categories**:  COPPER, INFOBASE, and ZENIQ Ecosystem  
3. **UI + UX Enhancements**: More compact design, better spacing, and visual refinements  
4. **Improved Language Handling**: Dynamic detection, language filtering, and UI indicators  
5. **File Navigation via URL**: Enabled deep linking and automatic scrolling  
6. **Enhanced File Handling**: Added `.link` file support and better interaction behavior  
7. **Responsive UI Improvements**: Smarter layouts for mobile vs desktop
