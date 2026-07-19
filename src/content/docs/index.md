---
title: Build Your Own Active Directory Homelab
description: A beginner-friendly, step-by-step guide to building a Windows Server and Active Directory lab without purchasing software.
template: splash
hero:
  tagline: Learn real enterprise IT skills on the computer you already own. No software purchase or prior experience required.
  actions:
    - text: Start the Guide
      link: /01-prerequisites/
      icon: right-arrow
      variant: primary
---

## What You Will Build

By the end of this guide you will have a small but realistic corporate network running entirely inside your computer:

- A **Windows Server 2025** virtual machine acting as a domain controller, running Active Directory Domain Services (AD DS), DNS, and DHCP
- One or two **Windows 11** client machines joined to your domain, just like workstations in a real office
- Users, groups, shared folders, and Group Policy settings that you create and manage yourself

## Who This Is For

This guide is written for beginners. If you are curious about IT, studying for certifications, or want hands-on experience with the tools that run most business networks, you are in the right place. No prior experience with servers or virtualization is required.

## What It Costs

You do not need to purchase software to complete the lab:

- The **VirtualBox base package** is free and open-source virtualization software
- **Windows Server 2025** is available as a 180-day evaluation from Microsoft
- **Windows 11 Enterprise** is available as a 90-day evaluation from Microsoft

The Windows downloads are time-limited evaluation licenses, not permanently free Windows licenses. The [evaluation-license appendix](/appendix/eval-rearm/) explains how to check their expiration dates and whether an installed evaluation has a rearm available.

The only requirement is a reasonably capable computer. Module 1 covers exactly what you need.
