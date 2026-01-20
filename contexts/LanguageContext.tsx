'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'km'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<Language, Record<string, string>> = {
  en: {
    'home': 'Home', 'explore': 'Explore', 'upload': 'Upload', 'favorites': 'Favorites', 'profile': 'Profile',
    'login': 'Login', 'signup': 'Sign Up', 'logout': 'Logout', 'settings': 'Settings', 'language': 'Language',
    'theme': 'Theme', 'admin': 'Admin', 'viewProfile': 'View Profile', 'signOut': 'Sign Out', 'adminPanel': 'Admin Panel',
    'user': 'User', 'email': 'Email', 'share': 'Share', 'like': 'Like', 'comment': 'Comment',
    'search': 'Search documents', 'filter': 'Filter', 'category': 'Category', 'date': 'Date', 'downloads': 'Downloads',
    'views': 'Views', 'description': 'Description', 'addToFavorites': 'Add to Favorites', 'removeFromFavorites': 'Remove from Favorites',
    'download': 'Download', 'selectCategory': 'Select Category', 'academics': 'Academics', 'technology': 'Technology',
    'business': 'Business', 'legal': 'Legal', 'noDocuments': 'No documents found', 'loading': 'Loading...', 'error': 'Error',
    'success': 'Success', 'cancel': 'Cancel', 'save': 'Save', 'delete': 'Delete', 'edit': 'Edit', 'create': 'Create',
    'heroTitle': 'Share Digital Documents', 'heroSubtitle': 'For Students', 'heroDescription': 'The most modern digital document sharing platform for Cambodian students. Share, study and grow together.',
    'recentDocuments': 'Recent Documents', 'searchDocuments': 'Find documents that match your study needs', 'mission': 'Mission & Vision of DocuLink',
    'missionDescription': 'We are a digital platform created by students for students to provide opportunities to share knowledge and study resources.',
    'shareStudyMaterial': 'Share Study Materials', 'shareDescription': 'Share assignments, books and study materials', 'studentCommunity': 'Student Community',
    'communityDescription': 'Connect all students in learning and sharing', 'digitalDocuments': 'Digital Documents', 'documentsDescription': 'Provide easy access to digital documents',
    'easySearch': 'Easy Search', 'searchDescription': 'Powerful document search system', 'security': 'Security', 'securityDescription': 'Protect your documents and privacy',
    'benefits': 'Benefits of Using DocuLink', 'uploadFree': 'Upload for Free', 'uploadBenefit': 'Upload documents for free', 'unlimited': 'Unlimited',
    'downloadFree': 'Download for Free', 'downloadBenefit': 'Download documents for free', 'noLimit': 'Unlimited', 'impact': 'DocuLink Impact',
    'impactDescription': 'Numbers that show our commitment to sharing knowledge', 'activeStudents': 'Active Students',
    'documentTypes': 'Document Types', 'availability': '24/7 Availability', 'availableTypes': 'Document Types Available', 'findDocuments': 'Find documents that match your study needs',
    'universityMaterials': 'University Study Materials', 'universityDescription': 'Assignments, books and study materials from many universities',
    'techResources': 'Technology Resources', 'techDescription': 'Code, programs and technical documents for engineering students', 'businessDocuments': 'Business Documents',
    'businessDescription': 'Document templates, reports and business resources', 'testimonials': 'Student Testimonials', 'testimonialDescription': 'Hear what our students say about their experience using DocuLink',
    'faq': 'Frequently Asked Questions', 'faqDescription': 'Find answers to questions users often ask', 'question1': 'Is DocuLink a free platform?',
    'answer1': 'Yes! DocuLink is completely free. You can upload documents, download documents, and share knowledge for free.', 'question2': 'What types of documents can I upload?',
    'answer2': 'You can upload PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, images and other documents related to studies.', 'question3': 'Is my document safe?',
    'answer3': 'Yes! We take document security very seriously. All documents are ensured security and privacy.', 'question4': 'Can I share my documents with other students?',
    'answer4': 'Yes! That is the main purpose of our platform. You can easily share your documents with other students.', 'question5': 'Is there a limit to documents I can upload?',
    'answer5': 'Currently we have no document limit. You can upload as many documents as you want.', 'moreQuestions': 'More questions? Contact us',
    'joinToday': 'Join Sharing Documents Today', 'joinDescription': 'Stay in DocuLink with a real community of students who just hope to exchange documents through sharing. Head to the details of their learning.',
    'uploadFreeButton': 'Upload Documents for Free', 'uploadFreeDescription': 'Upload various document types without problems', 'findEasyButton': 'Find Documents Easily',
    'findEasyDescription': 'Discover the documents you welcome', 'communityButton': 'Powerful Community', 'communityButtonDescription': 'Connect with like-minded students',
    'stats': 'Active 10,000+ Documents | 5,000+ Students', 'footer': 'About DocuLink', 'footerDescription': 'Our mission is to share documents to help all students in study and research.',
    'quickLinks': 'Quick Links', 'information': 'Information', 'contact': 'Contact', 'address': 'Address: XXXX, Road YYYY, Phnom Penh',
    'phone': '(855) 12 345 678', 'copyright': '© 2026 Doculink. All rights reserved.', 'aboutUs': 'About Us', 'contactUs': 'Contact Us',
    'privacyPolicy': 'Privacy Policy', 'termsOfUse': 'Terms of Use', 'help': 'Help', 'community': 'Community', 'events': 'Events', 'articles': 'Articles',
    'documentsHeader': 'Documents & Resources', 'documentsSubtitle': 'Share, search and learn from others\' documents', 'searchPlaceholder': 'Search documents, topics or tags...',
    'all': 'All', 'by': 'By', 'reads': 'Reads', 'uploadedOn': 'Uploaded on', 'uploadDocument': 'Upload Document', 'shareEducation': 'Share your educational work',
    'documentInfo': 'Document Information', 'titleLabel': 'Title', 'titleRequired': 'Title is required', 'descriptionLabel': 'Description',
    'classification': 'Classification', 'categoryLabel': 'Category', 'difficultyLevel': 'Difficulty Level', 'beginner': 'Beginner', 'intermediate': 'Intermediate',
    'advanced': 'Advanced', 'subjectLabel': 'Subject', 'uploadSuccess': 'Document uploaded successfully. It will appear after admin review.',
    'uploadError': 'Please complete the form and upload the document.', 'uploadButton': 'Upload Document', 'pleaseLoginFirst': 'Please login first.',
    'favoriteDocuments': 'Favorite Documents', 'yourFavorites': 'Your account has', 'savedDocuments': 'saved documents', 'noFavorites': 'No favorite documents yet',
    'saveFavoritesText': 'Save documents you like as they appear', 'findDocumentsButton': 'Find Documents', 'removeFavorites': 'Remove from favorites',
    'editProfile': 'Edit Profile', 'joinedOn': 'Joined on', 'administrator': 'Administrator', 'uploadedDocuments': 'Uploaded Documents', 'totalLikes': 'Likes',
    'totalComments': 'Comments', 'totalSaved': 'Saved Documents', 'saveChanges': 'Save Changes', 'adminDashboard': 'Admin Dashboard',
    'manageDocumentsUsers': 'Manage documents and users', 'pendingDocuments': 'Pending Documents', 'activeUsers': 'Active Users', 'totalViews': 'Total Views',
    'pending': 'Pending', 'allDocuments': 'All Documents', 'tableTitle': 'Title', 'tableSubmitter': 'Submitter', 'tableType': 'Type', 'tableDate': 'Date',
    'tableActions': 'Actions', 'noPendingDocuments': 'No pending documents', 'approve': 'Approve', 'reject': 'Reject', 'view': 'View',
    'welcomeBack': 'Welcome Back', 'signInToContinue': 'Sign in to continue', 'emailLabel': 'Email', 'emailRequired': 'Email is required',
    'emailInvalid': 'Invalid email', 'passwordLabel': 'Password', 'passwordRequired': 'Password is required', 'incorrectPassword': 'Incorrect password',
    'accountNotFound': 'Account not found', 'tooManyAttempts': 'Too many attempts. Please try again later', 'signInButton': 'Sign In',
    'signInWithGoogle': 'Sign in with Google', 'noAccount': 'Don\'t have an account?', 'createAccount': 'Create New Account', 'signUpNow': 'Sign Up Now',
    'startSharing': 'Start sharing knowledge together', 'confirmPassword': 'Confirm Password', 'confirmPasswordRequired': 'Please confirm your password',
    'passwordMismatch': 'Passwords don\'t match', 'atLeast6Chars': 'At least 6 characters', 'signUpButton': 'Sign Up', 'alreadyHaveAccount': 'Already have an account?',
    'signIn': 'Sign In',
    'heroTitleNew': 'Document Management System',
    'heroDescriptionNew': 'All-in-one platform to share, discover, and manage study documents. Connect with students worldwide and access the resources you need.',
    'getStarted': 'Get Started',
    'improveWorkflow': 'Improve Your Workflow',
    'documentsShared': 'Documents Shared',
    'support': 'Support',
    'aboutTitle': 'About DocuLinks',
    'aboutDescription': 'DocuLinks is a platform dedicated to connecting students and educators worldwide through the sharing of study documents. Our mission is to make knowledge accessible to everyone, fostering a community of learning and collaboration.',
    'benefitsTitle': 'Benefits of Sharing Documents',
    'benefitsDesc': 'Discover the advantages of being part of our document sharing community',
    'expandKnowledge': 'Expand Knowledge',
    'expandDesc': 'Access a wide range of study materials and gain new insights from diverse sources.',
    'buildCommunity': 'Build Community',
    'buildDesc': 'Connect with fellow students and educators, fostering collaboration and support.',
    'improveSkills': 'Improve Skills',
    'improveDesc': 'Enhance your learning experience and develop valuable research and sharing skills.',
    'impactTitle': 'Our Impact',
    'impactDesc': 'Numbers that reflect our growing community',
    'testimonialsTitle': 'What Our Users Say',
    'testimonialsDesc': 'Hear from students who have benefited from DocuLinks',
    'test1': '"DocuLinks has been a game-changer for my studies. I found so many helpful resources that I wouldn\'t have access to otherwise."',
    'test2': '"The community here is amazing. Sharing my notes has helped so many people, and I\'ve learned a lot from others too."',
    'test3': '"Easy to use and find exactly what I need. DocuLinks has improved my academic performance significantly."',
    'user1': 'Sarah Johnson',
    'user1role': 'Computer Science Student',
    'user2': 'Mike Chen',
    'user2role': 'Engineering Student',
    'user3': 'Emma Davis',
    'user3role': 'Medical Student',
    'faqTitle': 'Frequently Asked Questions',
    'faqDesc': 'Get answers to common questions about DocuLinks',
    'q1': 'Is DocuLinks free to use?',
    'a1': 'Yes, DocuLinks is completely free for students to upload, download, and share documents.',
    'q2': 'What types of documents can I upload?',
    'a2': 'You can upload PDFs, Word documents, PowerPoint presentations, images, and other study materials.',
    'q3': 'How do I ensure my documents are safe?',
    'a3': 'We use secure servers and encryption to protect your documents. Only authorized users can access shared content.',
    'q4': 'Can I collaborate with other students?',
    'a4': 'Absolutely! DocuLinks fosters a collaborative community where students can share knowledge and learn together.',
    'ctaTitle': 'Ready to Share Your Knowledge?',
    'ctaDesc': 'Join thousands of students sharing and discovering study materials. Start uploading your documents today!',
    'uploadDoc': 'Upload Document',
    'exploreDocs': 'Explore Documents',
    'needHelp': 'Need Help? Contact Us',
  },
  km: {
    'home': 'ទំព័រដើម', 'explore': 'រុករក', 'upload': 'ផ្ទុក', 'favorites': 'ចូលចិត្ត', 'profile': 'ប្រវត្តិលម្អិត',
    'login': 'ចូល', 'signup': 'ចុះឈ្មោះ', 'logout': 'ចាក់ចេញ', 'settings': 'ការកំណត់', 'language': 'ភាសា',
    'theme': 'ស្បែក', 'admin': 'ឯកសារគ្រប់គ្រង', 'viewProfile': 'ទស្សនាលម្អិត', 'signOut': 'ចាកចេញ', 'adminPanel': 'ផ្ទាំងគ្រប់គ្រង',
    'user': 'អ្នកប្រើប្រាស់', 'email': 'អ៊ីមែល', 'share': 'ចែករំលែក', 'like': 'ចូលចិត្ត', 'comment': 'មតិយោបល់',
    'search': 'ស្វែងរកឯកសារ', 'filter': 'ច្រោះលាង', 'category': 'ប្រភេទ', 'date': 'កាលបរិច្ឆេទ', 'downloads': 'ការទាញយក',
    'views': 'ការមើល', 'description': 'ការពិពណ៌នា', 'addToFavorites': 'បន្ថែមទៅចូលចិត្ត', 'removeFromFavorites': 'លុបចេញពីចូលចិត្ត',
    'download': 'ទាញយក', 'selectCategory': 'ជ្រើសរើសប្រភេទ', 'academics': 'សិក្សាធិការ', 'technology': 'បច្ចេកវិទ្យា',
    'business': 'ធុរកិច្ច', 'legal': 'ច្បាប់', 'noDocuments': 'មិនមានឯកសារ', 'loading': 'កំពុងផ្ទុក...', 'error': 'កំហុស',
    'success': 'សម្រេច', 'cancel': 'បោះបង់', 'save': 'រក្សាទុក', 'delete': 'លុប', 'edit': 'កែសម្រួល', 'create': 'បង្កើត',
    'heroTitle': 'ចែករំលែកឯកសារឌីជីថល', 'heroSubtitle': 'សម្រាប់និស្សិត', 'heroDescription': 'វេទិកាចែករំលែកឯកសារឌីជីថលដ៏ទំនើបបំផុតសម្រាប់និស្សិតកម្ពុជា។ ចែករំលែក រៀនសូត្របន្ត ចែករំលែក',
    'recentDocuments': 'ឯកសារថ្មីៗ', 'searchDocuments': 'ស្វែងរកឯកសារដែលត្រូវនឹងតម្រូវការសិក្សារបស់អ្នក', 'mission': 'គោលបំណង និងបេសកកម្មរបស់ DocuLink',
    'missionDescription': 'យើងជាវេទិកាឌីជីថលដែលបង្កើតឡើងដោយនិស្សិតសម្រាប់នស្សិត ដើម្បីផ្តល់ជូនឱកាសចែករំលែកចំណេះដឹង និងធនធានសិក្សា។',
    'shareStudyMaterial': 'ចែករំលែកសម្ភារៈសិក្សា', 'shareDescription': 'ចែករំលែកកិច្ចការដ្ឋាន សៀវភៅ និងសម្ភារៈសិក្សា', 'studentCommunity': 'សហគមន៍និស្សិត',
    'communityDescription': 'ភ្ជាប់និស្សិតទាំងអស់គ្នាក្នុងការរៀនសូត្របន្ត ចែករំលែក', 'digitalDocuments': 'ឯកសារឌីជីថល', 'documentsDescription': 'ផ្តល់ជូនឯកសារឌីជីថលដែលងាយស្រួលចូលប្រើ',
    'easySearch': 'ស្វែងរកងាយស្រួល', 'searchDescription': 'ប្រព័ន្ធស្វែងរកឯកសារដ៏មានប្រសិទ្ធភាព', 'security': 'សុវត្ថិភាព', 'securityDescription': 'ការពារឯកសារនិងភាពឯកជនភាពរបស់អ្នកប្រើប្រាស់',
    'benefits': 'អត្ថប្រយោជន៍នៃការប្រើប្រាស់ DocuLink', 'uploadFree': 'ចែករំលែកឯកសារ', 'uploadBenefit': 'ផ្ទុកឯកសារឡើងដោយឥតគិតថ្លៃ', 'unlimited': 'គ្មានកំណត់ចំនួន',
    'downloadFree': 'ទាញយកដោយឥតគិតថ្លៃ', 'downloadBenefit': 'ទាញយកឯកសារដោយឥតគិតថ្លៃ', 'noLimit': 'គ្មានកំណត់', 'impact': 'ផលប៉ះពាល់របស់ DocuLink',
    'impactDescription': 'តួលេខដែលនិយាយពីការប្តេជ្ញាចិត្តរបស់យើងក្នុងការចែករំលែកចំណេះដឹង', 'activeStudents': 'និស្សិតសកម្ម',
    'documentTypes': 'ប្រភេទឯកសារ', 'availability': 'ឯកសារឌីជីថល', 'availableTypes': 'ប្រភេទឯកសារដែលមាន', 'findDocuments': 'ស្វែងរកឯកសារដែលត្រូវនឹងតម្រូវការសិក្សារបស់អ្នក',
    'universityMaterials': 'សម្ភារៈសិក្សាសាកលវិទ្យាល័យ', 'universityDescription': 'កិច្ចការដ្ឋាន សៀវភៅ និងសម្ភារៈសិក្សាពីសាកលវិទ្យាល័យជាច្រើន',
    'techResources': 'ធនធានបច្ចេកវិទ្យា', 'techDescription': 'កូដ កម្មវិធី និងឯកសារបច្ចេកទេs សម្រាប់អ្នកសិក្សាបច្ចេកវិទ្យា', 'businessDocuments': 'ឯកសារធុរកិច្ច',
    'businessDescription': 'គំរូឯកសារ របាយការណ៍ និងធនធានាធុរកិច្ច', 'testimonials': 'មតិយោបល់របស់និស្សិត', 'testimonialDescription': 'ស្តាប់អ្វីដែលនិស្សិតរបស់យើងនិយាយអំពីបទពិសោធន៍ក្នុងការប្រើប្រាស់វេទិកា DocuLink',
    'faq': 'សំណួរញឹកញាប់ (FAQ)', 'faqDescription': 'ស្វែងរកចម្លើយសម្រាប់សំណួរដែលអ្នកប្រើប្រាស់តែងតែសួរ', 'question1': 'តើ DocuLink គឺជាវេទិកាដោយឥតគិតថ្លៃទេ?',
    'answer1': 'បាទ! DocuLink ជាវេទិកាដោយឥតគិតថ្លៃទាំងស្រុង។ អ្នកអាចផ្ទុកឯកសារឡើង ទាញយកឯកសារ និងចែករំលែកចំណេះដឹងដោយឥតគិតថ្លៃ។', 'question2': 'តើខ្ញុំអាចផ្ទុកឯកសារប្រភេទអ្វីខ្លះ?',
    'answer2': 'អ្នកអាចផ្ទុកឯកសារប្រភេទ PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, រូបភាព និងឯកសារផ្សេងទៀតដែលទាក់ទងនឹងការសិក្សា។', 'question3': 'តើឯកសាររបស់ខ្ញុំមានសុវត្ថិភាពទេ?',
    'answer3': 'បាទ! យើងយកចិត្តទុកដាក់ខ្ពស់ចំពោះសុវត្ថិភាពឯកសារ។ ឯកសារទាំងអស់ត្រូវបានធានាសុវត្ថិភាព និងភាពឯកជនភាព។', 'question4': 'តើខ្ញុំអាចចែករំលែកឯកសាររបស់ខ្ញុំទៅកាន់និស្សិតផ្សេងទេ?',
    'answer4': 'បាទ! វាជាគោលបំណងចម្បងរបស់វេទិការបស់យើង។ អ្នកអាចចែករំលែកឯកសាររបស់អ្នកទៅកាន់និស្សិតផ្សេងទៀតដោយងាយស្រួល។', 'question5': 'តើមានកំណត់ចំនួនឯកសារដែលខ្ញុំអាចផ្ទុកឡើងបានទេ?',
    'answer5': 'បច្ចុប្បន្នយើងមិនមានកំណត់ចំនួនឯកសារទេ។ អ្នកអាចផ្ទុកឯកសារចំនួនប៉ុន្មានក៏បានដែលចង់បាន។', 'moreQuestions': 'មានសំណួរទៀតទេ? ទាក់ទងយើងខ្ញុំ',
    'joinToday': 'ចូលរួមចែករំលែកឯកសារថ្ងៃនេះ', 'joinDescription': 'សូមរស់នៅក្នុង DocuLink ដែលមាន​សហគមន៍ពិតប្រាកដរបស់និស្សិត ដែលគ្រាន់តែសង្ឃឹមថាផ្លាស់ប្តូរឯកសាររបស់ពួកគេតាមរយៈការចែករំលែក។ ឈានទៅលើផ្ទះលម្អិតនៃការរៀនសូត្របស់ពួកគេ។',
    'uploadFreeButton': 'ផ្ទុកឯកសារដោយឥតគិតថ្លៃ', 'uploadFreeDescription': 'ផ្ទុកឯកសារប្រភេទផ្សេងៗដោយមិនមានបញ្ហា', 'findEasyButton': 'ស្វែងរកឯកសារងាយស្រួល',
    'findEasyDescription': 'រកឃើញឯកសារដែលអ្នកស្វាគមន៍', 'communityButton': 'សហគមន៍ដ៏រឹងមាំ', 'communityButtonDescription': 'ភ្ជាប់ជាមួយនិស្សិតដែលមានគំនិតដូចគ្នា',
    'stats': 'សកម្ម 10,000+ ឯកសារ | និស្សិត 5,000+ នាក់', 'footer': 'អំពី DocuLink', 'footerDescription': 'បេសកកម្មរបស់យើងគឺការមានស្មារតីចែករំលែកឯកសារជំនួយដល់និស្សិតទាំងអស់ក្នុងការសិក្សារស្រាវជ្រាវ។',
    'quickLinks': 'តំណរភ្ជាប់រហ័ស', 'information': 'ព័ត៌មាន', 'contact': 'ទំនាក់ទំនង', 'address': 'ផ្ទះលេខ: XXXX, ផ្លូវ YYYY, ភ្នំពេញ',
    'phone': '(855) 12 345 678', 'copyright': '© 2026 Doculink។ រក្សាសិទ្ធិគ្រប់យ៉ាង។', 'aboutUs': 'អំពីរយើង', 'contactUs': 'ទំនាក់ទំនង',
    'privacyPolicy': 'គោលការណ៍ឯកជន', 'termsOfUse': 'លក្ខខណ្ឌប្រើប្រាស់', 'help': 'ជំនួយ', 'community': 'សហគមន៍', 'events': 'ព្រឹត្តិការណ៏', 'articles': 'អត្ថបទ',
    'documentsHeader': 'ឯកសារ និង ធនធាន', 'documentsSubtitle': 'ចែករំលែក ស្វែងរក និងរៀនសូត្របស់ឯកសារផ្សេងទៀត', 'searchPlaceholder': 'ស្វែងរក​ឯកសារ ប្រធានបទ ឬលក្ខណៈ...',
    'all': 'ទាំងអស់', 'by': 'ដោយ', 'reads': 'ការមើល', 'uploadedOn': 'បានផ្ទុកឡើងនៅថ្ងៃទី', 'uploadDocument': 'ផ្ទុកឯកសារ', 'shareEducation': 'ចែករំលែកលទ្ធផលអប់រំរបស់អ្នក',
    'documentInfo': 'ព័ត៌មាននៃឯកសារ', 'titleLabel': 'ចំណងជើង', 'titleRequired': 'ចំណងជើងគឺចាំបាច់', 'descriptionLabel': 'ការពិពណ៌នា',
    'classification': 'ការចាត់ថ្នាក់ប្រកាស', 'categoryLabel': 'ប្រភេទ', 'difficultyLevel': 'កម្រិតលំបាក', 'beginner': 'ចាប់ផ្តើម', 'intermediate': 'មធ្យម',
    'advanced': 'មិនបាន​សរសេរ', 'subjectLabel': 'ប្រធានបទ', 'uploadSuccess': 'ឯកសារបានលើកឡើងដោយជោគជ័យ។ វានឹងលេចឡើងបន្ទាប់ពីការត្រួតពិនិត្យរបស់ក្រុមគ្រប់គ្រង។',
    'uploadError': 'សូមបំពេញចងក្រងស្នើសុំ ហើយលើកឯកសារឡើង។', 'uploadButton': 'ផ្ទុកឯកសារ', 'pleaseLoginFirst': 'សូមចូលប្រើគណនីដំបូង។',
    'favoriteDocuments': 'ឯកសារដែលចូលចិត្ត', 'yourFavorites': 'គណនីរបស់អ្នក', 'savedDocuments': 'ឯកសារដែលរក្សាទុក', 'noFavorites': 'មិនទាន់មាន​ឯកសារ​ដែល​ចូលចិត្ត',
    'saveFavoritesText': 'រក្សាទុក​ឯកសារ​ដែលឯលក់ដូចដែលលេចឡើងក្នុង​ផ្ដាច់មុខ', 'findDocumentsButton': 'រក​ឯកសារ', 'removeFavorites': 'ដកចេញពីឯកសារដែលចូលចិត្ត',
    'editProfile': 'កែសម្រួលប្រវត្តិលម្អិត', 'joinedOn': 'ចូលរួមនៅថ្ងៃទី', 'administrator': 'អ្នកគ្រប់គ្រង', 'uploadedDocuments': 'ឯកសារផ្ទុកឡើង', 'totalLikes': 'ចូលចិត្ត',
    'totalComments': 'យោបល់', 'totalSaved': 'ឯកសារដែលរក្សាទុក', 'saveChanges': 'រក្សាទុក', 'adminDashboard': 'ផ្ទាំងគ្រប់គ្រង',
    'manageDocumentsUsers': 'គ្រប់គ្រងឯកសារ និង ប្រើប្រាស់', 'pendingDocuments': 'ឯកសារស្តង់ដរ', 'totalViews': 'ចម្លងសរុប',
    'pending': 'ស្តង់ដរ', 'allDocuments': 'ទាំងអស់', 'tableTitle': 'ចំណងជើង', 'tableSubmitter': 'អ្នកផ្ញើ', 'tableType': 'ប្រភេទ', 'tableDate': 'ថ្ងៃ',
    'tableActions': 'សកម្មភាព', 'noPendingDocuments': 'គ្មានឯកសារស្តង់ដរ', 'approve': 'យល់ព្រម', 'reject': 'បដិសេធ', 'view': 'មើល',
    'welcomeBack': 'សូមស្វាគមន៍ត្រឡប់មកវិញ', 'signInToContinue': 'ចូលគណនីរបស់អ្នកដើម្បីបន្ត', 'emailLabel': 'អ៊ីម៉ែល', 'emailRequired': 'អ៊ីម៉ែលគឺចាំបាច់',
    'emailInvalid': 'អ៊ីម៉ែលមិនត្រឹមត្រូវ', 'passwordLabel': 'ពាក្យសម្ងាត់', 'passwordRequired': 'ពាក្យសម្ងាត់គឺចាំបាច់', 'incorrectPassword': 'ពាក្យសម្ងាត់មិនត្រឹមត្រូវ',
    'accountNotFound': 'គណនីនេះមិនមាន', 'tooManyAttempts': 'ព្យាយាមលើសឆ្ងាយ សូមព្យាយាមម្តងទៀតក្រោយមក', 'signInButton': 'ចូលប្រើប្រាស់',
    'signInWithGoogle': 'ចូលជាមួយ Google', 'noAccount': 'មិនទាន់មានគណនីទេ?', 'createAccount': 'បង្កើតគណនីថ្មី', 'signUpNow': 'ចុះឈ្មោះឥឡូវនេះ',
    'startSharing': 'ចាប់ផ្តើមចែករំលែកចំណេះដឹងជាមួយគ្នា', 'confirmPassword': 'បញ្ជាក់ពាក្យសម្ងាត់', 'confirmPasswordRequired': 'សូមយើយ ពាក្យសម្ងាត់',
    'passwordMismatch': 'ពាក្យសម្ងាត់មិនផ្គូផ្គង', 'atLeast6Chars': 'យ៉ាងតិច ៦ តួអក្សរ', 'signUpButton': 'ចុះឈ្មោះ',
    'alreadyHaveAccount': 'មានគណនីរួចហើយ?', 'signIn': 'ចូលប្រើប្រាស់',
    'heroTitleNew': 'ប្រព័ន្ធគ្រប់គ្រងឯកសារ',
    'heroDescriptionNew': 'វេទិកាទាំងមូលសម្រាប់ចែករំលែក រកឃើញ និងគ្រប់គ្រងឯកសារសិក្សា។ ភ្ជាប់ជាមួយនិស្សិតទូទាំងពិភពលោក និងចូលប្រើធនធានដែលអ្នកត្រូវការ។',
    'getStarted': 'ចាប់ផ្តើម',
    'improveWorkflow': 'បង្កើនលំហូរការងារ',
    'documentsShared': 'ឯកសារចែករំលែក',
    'activeUsers': 'អ្នកប្រើប្រាស់សកម្ម',
    'support': 'ការគាំទ្រ',
    'aboutTitle': 'អំពី DocuLinks',
    'aboutDescription': 'DocuLinks គឺជាវេទិកាដែលឧទ្ទិសដល់ការភ្ជាប់និស្សិត និងគ្រូបង្រៀនទូទាំងពិភពលោកតាមរយៈការចែករំលែកឯកសារសិក្សា។ បេសកកម្មរបស់យើងគឺធ្វើឱ្យចំណេះដឹងអាចចូលប្រើបានសម្រាប់អ្នកទាំងអស់ លើកកម្ពស់សហគមន៍នៃការរៀនសូត្រ និងការសហការ។',
    'benefitsTitle': 'អត្ថប្រយោជន៍នៃការចែករំលែកឯកសារ',
    'benefitsDesc': 'រកឃើញអត្ថប្រយោជន៍នៃការជាផ្នែកនៃសហគមន៍ចែករំលែកឯកសាររបស់យើង',
    'expandKnowledge': 'ពង្រីកចំណេះដឹង',
    'expandDesc': 'ចូលប្រើសម្ភារៈសិក្សាពីប្រភពផ្សេងៗ និងទទួលបានការយល់ដឹងថ្មី។',
    'buildCommunity': 'កសាងសហគមន៍',
    'buildDesc': 'ភ្ជាប់ជាមួយនិស្សិត និងគ្រូបង្រៀនផ្សេងទៀត លើកកម្ពស់ការសហការ និងការគាំទ្រ។',
    'improveSkills': 'បង្កើនជំនាញ',
    'improveDesc': 'បង្កើនបទពិសោធន៍ការរៀនរបស់អ្នក និងអភិវឌ្ឍជំនាញស្រាវជ្រាវ និងចែករំលែកដ៏មានតម្លៃ។',
    'impactTitle': 'ផលប៉ះពាល់របស់យើង',
    'impactDesc': 'តួលេខដែលឆ្លុះបញ្ចាំងពីសហគមន៍កំពុងរីកចម្រើនរបស់យើង',
    'testimonialsTitle': 'អ្វីដែលអ្នកប្រើប្រាស់របស់យើងនិយាយ',
    'testimonialsDesc': 'ស្តាប់ពីនិស្សិតដែលបានទទួលអត្ថប្រយោជន៍ពី DocuLinks',
    'test1': '"DocuLinks បានផ្លាស់ប្តូរការសិក្សារបស់ខ្ញុំ។ ខ្ញុំបានរកឃើញធនធានជំនួយជាច្រើនដែលខ្ញុំមិនអាចចូលប្រើបានក្នុងករណីផ្សេងទេ។"',
    'test2': '"សហគមន៍នៅទីនេះគឺអស្ចារ្យណាស់។ ការចែករំលែកកំណត់ចំណាំរបស់ខ្ញុំបានជួយមនុស្សជាច្រើន ហើយខ្ញុំក៏បានរៀនចំណេះដឹងជាច្រើនពីអ្នកដទៃដែរ។"',
    'test3': '"ងាយស្រួលប្រើ និងរកឃើញអ្វីដែលខ្ញុំត្រូវការ។ DocuLinks បានបង្កើនការសម្តែងសិក្សារបស់ខ្ញុំយ៉ាងខ្លាំង។"',
    'user1': 'សារ៉ា ចូនសុន',
    'user1role': 'និស្សិតវិទ្យាសាស្ត្រកុំព្យូទ័រ',
    'user2': 'ម៉ាយក ចិន',
    'user2role': 'និស្សិតវិស្វកម្ម',
    'user3': 'អេម៉ា ដេវីស',
    'user3role': 'និស្សិតវេជ្ជសាស្ត្រ',
    'faqTitle': 'សំណួរដែលសួរញឹកញាប់',
    'faqDesc': 'ទទួលបានចម្លើយសម្រាប់សំណួរទូទៅអំពី DocuLinks',
    'q1': 'តើ DocuLinks អាចប្រើប្រាស់ដោយឥតគិតថ្លៃទេ?',
    'a1': 'បាទ វេទិកា DocuLinks អាចប្រើប្រាស់ដោយឥតគិតថ្លៃទាំងស្រុងសម្រាប់និស្សិតក្នុងការផ្ទុកឯកសារ ទាញយក និងចែករំលែក។',
    'q2': 'តើអ្នកអាចផ្ទុកឯកសារប្រភេទអ្វីខ្លះ?',
    'a2': 'អ្នកអាចផ្ទុកឯកសារប្រភេទ PDF, ឯកសារ Word, ការបង្ហាញ PowerPoint, រូបភាព និងសម្ភារៈសិក្សាផ្សេងទៀត។',
    'q3': 'តើខ្ញុំអាចធានាបានយ៉ាងណា ថាឯកសាររបស់ខ្ញុំមានសុវត្ថិភាព?',
    'a3': 'យើងប្រើប្រាស់ម៉ាស៊ីនមេមានសុវត្ថិភាព និងការអ៊ិនគ្រីបដើម្បីការពារឯកសាររបស់អ្នក។ មានតែអ្នកប្រើប្រាស់ដែលមានសិទ្ធិទើបអាចចូលប្រើបាន។',
    'q4': 'តើខ្ញុំអាចសហការជាមួយនិស្សិតផ្សេងទេ?',
    'a4': 'ទាំងស្រុង! DocuLinks លើកកម្ពស់សហគមន៍សហការដែលនិស្សិតអាចចែករំលែកចំណេះដឹង និងរៀនជាមួយគ្នា។',
    'ctaTitle': 'ត្រៀមរួចជាស្រេចដើម្បីចែករំលែកចំណេះដឹងរបស់អ្នកទេ?',
    'ctaDesc': 'ចូលរួមជាមួយនិស្សិតរាប់ពាន់នាក់ក្នុងការចែករំលែក និងរកឃើញសម្ភារៈសិក្សា។ ចាប់ផ្តើមផ្ទុកឯកសាររបស់អ្នកឡើងថ្ងៃនេះ!',
    'uploadDoc': 'ផ្ទុកឯកសារ',
    'exploreDocs': 'រុករកឯកសារ',
    'needHelp': 'មានសំណួរទៀតទេ? ទាក់ទងយើងខ្ញុំ',
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('km')
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    setIsHydrated(true)
    const savedLanguage = localStorage.getItem('language') as Language | null
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'km')) {
      setLanguageState(savedLanguage)
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language.startsWith('en') ? 'en' : 'km'
      setLanguageState(browserLang)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
    }
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  // Prevent hydration mismatch by not rendering until hydrated
  if (!isHydrated) {
    return (
      <LanguageContext.Provider value={{ language: 'km', setLanguage, t }}>
        {children}
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}