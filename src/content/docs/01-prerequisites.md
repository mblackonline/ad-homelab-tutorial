---
title: "Module 1: Prerequisites"
description: Hardware requirements, software downloads, and why this guide uses VirtualBox.
---

Before building anything, you need to make sure your computer can handle the lab and gather the software you will install. This module walks through all of it. Everything you download here is free and comes directly from the official vendors.

## In This Module

- Check that your computer meets the hardware requirements (CPU, RAM, disk space)
- Enable virtualization in your BIOS/UEFI if needed
- Download VirtualBox
- Download the Windows Server 2025 evaluation ISO
- Download the Windows 11 Enterprise evaluation ISO

## Why VirtualBox?

This guide uses VirtualBox because it is completely free, requires no account to download, runs on Windows, Linux, and Intel-based Macs, and makes it easy to enable the TPM 2.0 chip that Windows 11 requires. Other hypervisors exist (VMware Workstation, Hyper-V, and more), but they are beyond the scope of this tutorial.

## Hardware Requirements

The lab runs two virtual machines at the same time: a Windows Server domain controller and a Windows 11 client. Your computer (the "host") needs enough resources to run both VMs plus its own operating system.

### CPU

You need a 64-bit Intel or AMD processor with hardware virtualization support. Almost any desktop or laptop CPU from the last ten years qualifies. Intel calls this feature VT-x and AMD calls it AMD-V.

:::caution
Apple Silicon Macs (M1, M2, M3, and newer) are not supported. This lab requires an x86 PC because the Windows evaluation ISOs used in this guide are built for Intel and AMD processors. If you have an Intel-based Mac, you can follow along.
:::

### RAM

**16 GB is recommended.** With 16 GB, you can run the domain controller (4 GB), a Windows 11 client (4 GB), and still have 8 GB left for your host operating system. Everything will run smoothly.

**8 GB is the absolute minimum, and it will be rough.** If 8 GB is all you have, you can still complete this lab, but go in with the right expectations:

- Both VMs and your host will be fighting over the same memory, so everything will be slow. Windows installs that take 20 minutes on a 16 GB machine may take an hour or more.
- You will need to close every other program on your host while the lab is running. No browser tabs, no music, nothing.
- You may need to run only one VM at a time for some tasks, which makes parts of this guide harder to follow.
- Freezes and crashes are more likely, so take snapshots often (covered in the appendix).

If you are on 8 GB and find the experience too frustrating, that is not a reflection of your skills. It is a hardware limitation. The lab will still teach you the concepts, just more slowly.

### Disk Space

You need at least **100 GB of free disk space**. The virtual machines store their hard drives as large files on your computer, and Windows Server and Windows 11 each need room to install and update. An SSD is strongly recommended. The lab will work on a spinning hard drive, but it will be noticeably slower.

To check your free space on Windows, open File Explorer and click This PC. Your drives and their free space are listed there.

## Enable Virtualization in BIOS/UEFI

Hardware virtualization is sometimes turned off from the factory. Check whether it is enabled before installing anything:

1. On Windows, press Ctrl + Shift + Esc to open Task Manager.
2. Click the Performance tab, then click CPU.
3. Look for the line that says **Virtualization**. If it says Enabled, you are done with this step. Skip ahead to the downloads.

If it says Disabled, you need to turn it on in your computer's BIOS/UEFI settings:

1. Restart your computer and press the setup key while it boots. The key varies by manufacturer. Common ones are Delete, F2, F10, and F12. The boot screen usually shows which key to press, or you can search the web for your computer model plus "BIOS key".
2. Find the virtualization setting. It is usually under a menu named Advanced, CPU Configuration, or Security. Look for **Intel Virtualization Technology**, **Intel VT-x**, **AMD-V**, or **SVM Mode**.
3. Set it to Enabled, then save and exit (usually F10).
4. Boot back into Windows and check Task Manager again to confirm it now says Enabled.

:::note
Every BIOS looks different. If you cannot find the setting, search the web for your computer or motherboard model plus "enable virtualization". This is a very common task and there are guides for nearly every model.
:::

## Download VirtualBox

1. Go to the official site: [virtualbox.org](https://www.virtualbox.org/)
2. Click Downloads and choose the package for your host operating system (Windows, Linux, or macOS on Intel).
3. Save the installer. Do not run it yet. Installation is covered in Module 2.

Download VirtualBox only from virtualbox.org. Third-party download sites sometimes bundle unwanted software.

## Download Windows Server 2025

Microsoft provides a free 180-day evaluation of Windows Server 2025. It is the full product, just time-limited, and the appendix covers how to extend the trial when it runs low.

1. Go to the [Windows Server 2025 page on the Microsoft Evaluation Center](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2025).
2. Under the ISO download option, click Download the ISO.
3. Fill out the registration form. Microsoft asks for a name, email, and company. This is a marketing form, not a license check. Use an email you can access.
4. Choose **English (United States)** and the **64-bit edition** ISO.
5. Save the file. It is large, roughly 5 to 6 GB, so the download may take a while.

:::note
The evaluation ISO includes both the Standard and Datacenter editions. You will pick an edition during installation in Module 3, so you only need this one file.
:::

## Download Windows 11 Enterprise

Microsoft also provides a free 90-day evaluation of Windows 11 Enterprise for the client machines.

1. Go to the [Windows 11 Enterprise page on the Microsoft Evaluation Center](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-11-enterprise).
2. Select the ISO download option and fill out the same style of registration form.
3. Choose **English (United States)** and the **64-bit** ISO.
4. Save the file. It is also several GB.

:::note
Why Enterprise and not Home or Pro? The Enterprise evaluation is free, does not require a product key, and supports joining an Active Directory domain, which is the whole point of this lab. Windows 11 Home cannot join a domain at all.
:::

## Checklist Before Moving On

- [ ] CPU virtualization shows Enabled in Task Manager
- [ ] At least 100 GB of free disk space
- [ ] VirtualBox installer downloaded
- [ ] Windows Server 2025 evaluation ISO downloaded
- [ ] Windows 11 Enterprise evaluation ISO downloaded

Once all five boxes are checked, continue to Module 2 to install VirtualBox and build the lab network.
