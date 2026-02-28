

# Update Portfolio Projects with Real Data

## Overview

Replace the 6 demo projects in the database with real project data extracted from the provided URLs. All projects will be categorized as "Web + App" since they work on both platforms.

## Projects to Update

### 1. Quran Insight (quraninsight.app)
- **Title**: Quran Insight
- **Category**: Web + App
- **Description**: AI-powered Quran search and learning platform with Bengali and English support. Features include Tafsir, daily verses, duas, hadith, prayer times, Islamic calendar, Qibla direction, and Names of Allah.
- **Tech**: React, AI, Tailwind CSS, TypeScript
- **Link**: https://quraninsight.app/

### 2. Quran Insight Download Page (download.quraninsight.app)
- **Title**: Quran Insight Mobile
- **Category**: Web + App
- **Description**: Mobile app landing and download page for Quran Insight. AI-powered Quran search, Bengali and English Tafsir, daily verses, duas, hadith, and Masail -- free with no ads.
- **Tech**: React Native, AI, TypeScript
- **Link**: http://download.quraninsight.app/

### 3. Ramadan Insight (ramadan.quraninsight.app)
- **Title**: Ramadan Insight
- **Category**: Web + App
- **Description**: Ramadan companion app with real-time Sehri and Iftar countdown, daily Quranic verses, prayer niyyat guides, fasting tracker, and location-based Islamic calendar integration.
- **Tech**: React, Tailwind CSS, TypeScript
- **Link**: https://ramadan.quraninsight.app/

### 4. Quiz Insight (quizinsight.quraninsight.app)
- **Title**: Quiz Insight
- **Category**: Web + App
- **Description**: Interactive Islamic knowledge quiz platform with user authentication, progress tracking, and engaging question-based learning to test and improve understanding of Islam.
- **Tech**: React, Supabase, Tailwind CSS, TypeScript
- **Link**: https://quizinsight.quraninsight.app/

### 5. Muslims Day (muslimsday.lovable.app)
- **Title**: Muslims Day
- **Category**: Web + App
- **Description**: All-in-one daily Islamic companion with accurate prayer times, Sehri/Iftar schedules, Quran reader, dua collection, Islamic calendar, and location-based notifications with prohibited prayer time alerts.
- **Tech**: React, Tailwind CSS, TypeScript, PWA
- **Link**: https://muslimsday.lovable.app

### 6. Expertise Editor (expertiseeditor.com)
- **Title**: Expertise Editor
- **Category**: Web + App
- **Description**: Complete online PDF toolkit with 27 free tools for merging, splitting, compressing, converting, editing, and securing PDF documents. Features AI-powered tools, fast processing, and browser-based operation with no installation required.
- **Tech**: React, AI, Tailwind CSS, TypeScript
- **Link**: https://expertiseeditor.com/

## Implementation Steps

1. **Delete all 6 existing demo projects** from the database using SQL
2. **Insert the 6 real projects** with the extracted data above, ordered 1-6 as listed
3. **Take screenshots** from the fetched website data and upload them to the storage bucket as project cover images
4. Budget and date fields will be left empty as requested

## Technical Details

- Use the database insert tool to delete old rows and insert new ones into the `projects` table
- Upload screenshots to the `uploads/projects/` storage bucket for cover images
- Update `image_url` for each project to point to the uploaded screenshot
- No code changes needed -- the existing Portfolio page and ProjectsEditor will work with the new data automatically

