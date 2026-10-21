# IBDA — Product Flow, UI/UX, and Feature Completion Brief

## Role and objective

Act as a senior product designer and full-stack engineer. Update the existing application currently called **ContentEngine** and rename it to **IBDA** everywhere in the product. Implement the changes directly in the existing codebase, preserving its current architecture and working features unless a change is explicitly required below.

Do not stop at suggestions or a visual mockup. Inspect the project, understand the current components and routing, review the supplied ZIP and screenshots, then implement the complete user flow and UI updates. Reuse the attached reference assets wherever applicable.

## 1. Rename the product to IBDA

- Replace **ContentEngine** with **IBDA** throughout the application.
- Update visible branding, page titles, navigation labels where relevant, metadata, loading states, empty states, and other user-facing references.
- Update the logo/brand presentation to match IBDA. Avoid leaving old-name references in the interface.
- Do not rename unrelated technical identifiers or external configuration values if doing so would break functionality; prioritize a complete user-facing rebrand.

## 2. Implement the first-time app experience

Build the following flow in this exact order:

1. **Animated IBDA splash screen**
   - When a user opens the app, show the IBDA logo with a polished, brief animation.
   - Keep the animation smooth, purposeful, and consistent with the app's visual style.
   - Avoid an unnecessarily long splash screen. Respect reduced-motion preferences where practical.

2. **Login or sign-up choice**
   - After the splash screen, show a clear choice to **Log in** or **Sign up**, following familiar modern app conventions.
   - Use the supplied ZIP folder's login and sign-up page designs as the source of truth. Inspect and reuse the provided assets, layouts, wording, and styling as closely as practical.
   - Connect the screens to the project's existing authentication system if one exists. Do not create fake authentication success states or break existing auth functionality.
   - Include sensible validation, loading, and error states consistent with the existing stack.

3. **Post-sign-up onboarding**
   - After successful sign-up, guide new users through the onboarding pages shown in the supplied screenshots.
   - Inspect all provided screenshots and reproduce the intended sequence, layout, and content as faithfully as practical.
   - Provide a clearly visible **Skip** option so users can skip onboarding.
   - Keep onboarding progress and completion behavior coherent. Users who complete or skip onboarding should not be forced through it repeatedly unless the current product explicitly requires that.
   - Returning users should follow the appropriate login/session flow rather than being sent through first-time onboarding every time.

4. **Dashboard**
   - After onboarding is completed or skipped, take the user to the main dashboard.
   - Authenticated returning users should land on the appropriate main app page.
   - Preserve existing dashboard features and integrate the navigation, search, profile, and Pro-upgrade improvements below.

## 3. Reorder the main navigation

Reorder the primary tabs to this exact sequence:

1. **Home**
2. **Brand**
3. **Approval**
4. **Scheduled**
5. **Analytics**

- Update the tab order everywhere it appears, including desktop navigation, mobile navigation, responsive menus, and any related navigation configuration.
- Ensure each tab routes to the correct existing page and that active states remain accurate.
- Update the tab colors and active/inactive states. The current colors look unusual; choose a more cohesive, polished palette that fits IBDA's existing design system.
- Maintain accessible contrast, readable labels, clear hover/focus states, and consistent icon treatment.
- Do not introduce an unrelated visual theme or use excessive accent colors.

## 4. Add search where it is useful

Review the application page by page and add search bars to pages where users would reasonably need to find existing content quickly.

Potential areas include:
- Brand lists or brand assets
- Approval queues and submitted content
- Scheduled content
- Analytics reports or records, if the page contains searchable items
- Any other data-heavy list where search materially improves usability

Requirements:
- Do not add search bars mechanically to every page. Use product judgment based on the page's purpose and the type of data displayed.
- Search should actually filter or query the page's relevant data, not merely be decorative.
- Use appropriate placeholder text, such as “Search scheduled content…” or “Search brands…”.
- Include a clear/reset affordance when appropriate and a useful empty state when there are no matches.
- Keep search styling consistent with the IBDA design system and responsive layouts.
- If the project already has filtering or search logic, extend and reuse it rather than duplicating it.

## 5. Complete the profile menu and profile pages

When the user clicks the profile/avatar icon, show a polished dropdown or popover menu modeled on the supplied reference picture.

- Inspect the provided screenshot and match its structure, visual hierarchy, spacing, and interactions as closely as practical.
- The menu should open and close reliably, be positioned correctly, and work with mouse, touch, and keyboard interactions.
- Close it when the user selects an item or clicks outside it, as appropriate.
- Include the relevant destinations already supported by the app, such as profile/account settings, preferences, subscription/billing, help, and sign out, where appropriate.

The profile experience is currently incomplete. Use product judgment to identify and implement the missing pieces needed for a coherent, production-quality profile/account area. At minimum, inspect the existing project and implement the relevant sections below where they fit the product:

- **Personal profile:** name, email, avatar/profile image, and editable fields supported by the current data model.
- **Account settings:** basic account details and security-related settings supported by the existing authentication setup.
- **Preferences:** relevant user and notification preferences, if supported by the product.
- **Subscription and billing:** current plan, upgrade/manage-plan entry points, and billing details where supported.
- **Sign out:** a working sign-out action using the existing authentication system, followed by the appropriate logged-out screen.
- **Loading, error, and empty states:** make incomplete or unavailable account data understandable instead of leaving broken or blank sections.

Keep the profile menu and profile pages consistent with the existing app. Do not invent backend capabilities, persist data only in local state when it is expected to be server-backed, or expose sensitive account information. If a feature requires backend support that does not exist, implement the UI in a way that accurately reflects the current capabilities and clearly identify the missing integration.

## 6. Add the missing Pro upgrade and payment flow

The **Upgrade Pro** action currently lacks the necessary payment pages. Implement a complete, coherent upgrade journey.

- Clicking **Upgrade Pro** should navigate to a dedicated upgrade/pricing experience instead of doing nothing or leading to a missing page.
- Explain the available plan(s), their benefits, pricing, billing interval, and relevant limitations based on existing product information and configuration.
- Do not invent real prices, plan entitlements, discounts, or payment-provider behavior. First inspect the codebase, configuration, and supplied assets for the intended pricing and plan details.
- Provide a clear plan-selection and checkout flow.
- Include the appropriate checkout, payment-method, billing-details, processing, success, cancellation, and failure states that are relevant to the project's actual payment integration.
- If a payment provider is already integrated, use its existing SDK/API and follow its established flow. Never collect or store raw card details insecurely.
- If payment integration is absent, build the pricing and checkout UI and establish a clean integration boundary, but do not falsely report a payment as completed. Clearly identify any environment variables, backend endpoints, provider setup, or webhook handling required to activate real payments.
- Include a subscription confirmation/status view and a way to return to the app after the flow.
- Ensure the upgrade flow is accessible from every existing **Upgrade Pro** entry point and from the profile/subscription menu where appropriate.

## 7. Design quality and consistency

Treat this as a cohesive product improvement, not a collection of disconnected screens.

- Follow the existing framework, component conventions, styling system, and routing approach.
- Reuse shared components and design tokens wherever possible.
- Make the interface polished, modern, professional, and consistent with IBDA's branding.
- Ensure layouts work on desktop, tablet, and mobile.
- Provide clear page titles, useful empty states, form validation, loading indicators, error feedback, and confirmation feedback where relevant.
- Ensure buttons and links perform their advertised actions.
- Use semantic elements, accessible labels, keyboard navigation, visible focus states, and suitable contrast.
- Avoid dead links, placeholder buttons, duplicated logic, unnecessary dependencies, and hard-coded fake data presented as real user data.
- Preserve working existing features and avoid broad rewrites unrelated to these requirements.

## 8. Required inspection and implementation workflow

Before changing the code:

1. Inspect the project structure, framework, routing, authentication, design system, and current page implementations.
2. Locate and inspect the supplied ZIP folder and all attached screenshots. Identify which assets correspond to login, sign-up, onboarding, and the profile menu.
3. Trace the current dashboard navigation and every **Upgrade Pro** entry point.
4. Check whether profile data, search/filtering, onboarding state, subscription state, and payment-provider integration already exist.
5. Build a short internal implementation plan based on the actual codebase and references.

Then implement the changes in the existing project. Prefer small, maintainable changes that fit the current architecture.

## 9. Validation and acceptance criteria

Do not consider the task complete until you have checked the following:

- [ ] User-facing product branding says **IBDA**, not ContentEngine.
- [ ] The app opens with an animated IBDA logo.
- [ ] The splash screen leads to the Log in / Sign up choice.
- [ ] Login and sign-up pages follow the supplied ZIP references and use the existing authentication system.
- [ ] Successful sign-up leads to the supplied onboarding flow.
- [ ] Onboarding can be skipped and is not unnecessarily repeated.
- [ ] Completing or skipping onboarding leads to the dashboard.
- [ ] Main navigation is ordered Home → Brand → Approval → Scheduled → Analytics.
- [ ] Navigation colors and active states are visually cohesive and accessible.
- [ ] Search is present on appropriate pages and actually works.
- [ ] The avatar opens a profile menu consistent with the supplied reference screenshot.
- [ ] Relevant profile/account pages are complete, navigable, and functional within existing backend capabilities.
- [ ] Every Upgrade Pro entry point opens a working upgrade/pricing journey.
- [ ] Payment screens and outcomes accurately reflect the real payment integration; no fake successful payments.
- [ ] Responsive layouts, loading/error/empty states, and basic accessibility are addressed.
- [ ] Existing unrelated functionality still works.
- [ ] Run the available lint, type-check, tests, and/or build commands. Fix issues introduced by the changes and report any pre-existing failures separately.

## 10. Final handoff

When finished, provide a concise implementation report that includes:

1. The main changes completed.
2. The key files or components changed.
3. The validation commands run and their results.
4. Any missing credentials, backend endpoints, payment-provider configuration, or other blockers that prevent a feature from working end to end.
5. Any decisions made because the supplied screenshots or requirements were ambiguous.

**Important:** Use the supplied ZIP and screenshots as reference material rather than guessing what they contain. Inspect them first, implement the requested changes in the existing codebase, and be transparent about anything that cannot be fully connected or verified.
