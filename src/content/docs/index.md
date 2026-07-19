---
title: Build Your Own Active Directory Homelab
description: A beginner-friendly, step-by-step guide to building a Windows Server and Active Directory lab without purchasing software.
template: splash
hero:
  tagline: Build practical Windows Server and Active Directory skills in a guided homelab. Basic Windows and networking knowledge recommended.
  actions:
    - text: Start the Guide
      link: /01-prerequisites/
      icon: right-arrow
      variant: primary
---

:::caution[Use This Guide Responsibly]
This guide is for educational use in a personal homelab. Use only systems you own or are authorized to administer, and keep the exercises inside the dedicated VMs rather than work or production systems. You are responsible for the changes you make. The guide is provided "as is" without warranties; see the project's [MIT License](https://github.com/mblackonline/ad-homelab-tutorial/blob/main/LICENSE).
:::

:::note[AI-Assisted Development]
AI tools were used to assist with research, drafting, editing, and reviewing portions of this guide. AI-assisted material can be incomplete, inaccurate, or outdated. Verify important information against the linked official documentation and use your own judgment before making changes.
:::

## What You Will Build

By the end of this guide you will have a small but realistic corporate network running entirely inside your computer:

- A **Windows Server 2025** virtual machine acting as a domain controller, running Active Directory Domain Services (AD DS), DNS, and DHCP
- One or two **Windows 11** client machines joined to your domain, just like workstations in a real office
- Users, groups, shared folders, and Group Policy settings that you create and manage yourself

## Who This Is For

This guide is designed for learners with basic Windows and networking knowledge. You should be comfortable installing software and navigating Windows, and understand the basic purpose of IP addresses, subnets, default gateways, DNS, and DHCP. No prior experience with Windows Server, Active Directory, or VirtualBox is required.

## What It Costs

You do not need to purchase software to complete the lab:

- The **VirtualBox base package** is free and open-source virtualization software
- **Windows Server 2025** is available as a 180-day evaluation from Microsoft
- **Windows 11 Enterprise** is available as a 90-day evaluation from Microsoft

The Windows downloads are time-limited evaluation licenses, not permanently free Windows licenses. The [evaluation-license appendix](/appendix/eval-rearm/) explains how to check their expiration dates and whether an installed evaluation has a rearm available.

The only requirement is a reasonably capable computer. Module 1 covers exactly what you need.
