# Kiosk Navigation

## Context

Kiosk mode is used on physical devices in the Wellcome Collection building to provide a curated browsing experience. The KioskNavigation component provides navigation controls at the bottom of the screen to help users:

1. Navigate through browser history (back/forward buttons)
2. Return to the kiosk home page
3. Navigate between related works or stories (previous/next buttons)

## User stories

### Browser history navigation

**As a** kiosk user
**I want to** use back and forward buttons to navigate through my browsing history
**So that** I can easily return to previously viewed pages or move forward through pages I've navigated back from

**Given** I am viewing a work or story in kiosk mode
**When** I click links to navigate to other pages
**Then** the back button should become enabled after visiting multiple pages
**And** clicking back should return me to the previous page
**And** after going back, the forward button should become enabled
**And** clicking forward should return me to the page I was on before going back

**Given** I have navigated back in my history
**When** I click a link to navigate to a new page
**Then** the forward button should become disabled (as the forward history is cleared)

### Home navigation

**As a** kiosk user
**I want to** return to the kiosk home page at any time
**So that** I can start a new browsing session or explore different content

**Given** I am viewing any page in kiosk mode
**When** I click the "Back to: Home" button
**Then** I should be taken to the kiosk home page

### Content navigation (Previous/Next)

**As a** kiosk user
**I want to** navigate between related works or stories in a curated list
**So that** I can browse through related content without having to return to a list page

**Given** I am viewing a work that is part of a kiosk content list
**When** the work is not the first in the list
**Then** I should see an enabled "Prev" button
**And** clicking it should take me to the previous work in the list

**Given** I am viewing a work that is part of a kiosk content list
**When** the work is not the last in the list
**Then** I should see an enabled "Next" button
**And** clicking it should take me to the next work in the list

**Given** I am viewing the first work in a kiosk content list
**Then** the "Prev" button should be disabled

**Given** I am viewing the last work in a kiosk content list
**Then** the "Next" button should be disabled

### Progress indicator

**As a** kiosk user
**I want to** see my progress through a list of related works or stories
**So that** I understand how much content is available and where I am in the sequence

**Given** I am viewing a work or story that is part of a kiosk content list
**Then** I should see a counter showing my position (e.g., "3 / 10")
**And** I should see a label indicating what type of content I'm viewing (e.g., "Related works" or "Related stories")

### Inactivity reset

**As a** kiosk administrator
**I want** the browsing history to be cleared when the kiosk resets due to inactivity
**So that** each visitor starts with a fresh session and doesn't see the previous visitor's history

**Given** I am viewing pages in kiosk mode
**When** the inactivity timeout expires and the kiosk redirects to the home page
**Then** all navigation history should be cleared
**And** the back button should be disabled (as there is no history)
**And** I should start with a fresh browsing session from the home page
