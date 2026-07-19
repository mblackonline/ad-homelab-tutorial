---
title: "Module 3: Build the Server (DC01)"
description: Create the Windows Server 2025 virtual machine that will become your Domain Controller.
---

In this module you create your first VM and install Windows Server 2025 on it. By the end, you will have a fully patched server named DC01 with a static IP address, ready to become a domain controller in Module 4.

## In This Module

- Create the DC01 virtual machine (2 vCPU, 4 GB RAM, 60 GB dynamic disk)
- Install Windows Server 2025 with Desktop Experience
- Install VirtualBox Guest Additions
- Rename the computer to DC01
- Assign a static IP address
- Run Windows Update
- Take your first snapshot

## Create the Virtual Machine

1. In VirtualBox Manager, click **New**.
2. Fill in the first screen:
   - **Name:** `DC01`
   - **ISO Image:** browse to the Windows Server 2025 ISO from Module 1
   - Check **Skip Unattended Installation**. This matters. If you leave it unchecked, VirtualBox tries to automate the Windows install and you lose control of important choices.
3. Expand the **Hardware** section:
   - **Base Memory:** 4096 MB
   - **Processors:** 2
   - Check **Enable EFI**
4. Expand the **Hard Disk** section and set the size to **60 GB**. Leave it as a dynamically allocated VDI, which means the file starts small and grows as the VM uses space.
5. Click **Finish**. Do not start the VM yet.

### Attach It to the Lab Network

1. Select DC01 and click **Settings > Network**.
2. On Adapter 1, set **Attached to: NAT Network** and **Name: ADLab**.
3. Click **OK**.

## Install Windows Server 2025

1. Start the VM. When you see "Press any key to boot from CD or DVD", click inside the VM window and press a key quickly. If you miss it, close the VM (Power off) and start it again.
2. Choose your language and keyboard, then click **Install Now** (wording may vary slightly by build).
3. When asked to select an image, choose **Windows Server 2025 Standard Evaluation (Desktop Experience)**. The Desktop Experience part is essential. Without it you get no graphical interface, only a command line.
4. Accept the license terms and choose the **Custom** install option.
5. Select the empty 60 GB drive and click **Next**. The install takes a while. On an 8 GB host, it can take a very long while.
6. When prompted, set a password for the built-in Administrator account. Write it down. This guide uses the Administrator account for everything on DC01.

To log in, Windows asks for Ctrl+Alt+Del, but that key combo goes to your host instead of the VM. Use the VM window menu: **Input > Keyboard > Insert Ctrl-Alt-Del**.

:::note
The evaluation activates itself automatically over the internet, and it must do so within 10 days or the server starts shutting down on its own. Your VM has internet access through the lab network, so this happens without any action from you. Just do not block it from going online.
:::

## Install Guest Additions

Guest Additions makes the VM much nicer to use: the screen resizes with the window and the mouse moves smoothly.

1. With DC01 running and logged in, use the VM window menu: **Devices > Insert Guest Additions CD image**.
2. Inside the VM, open File Explorer, open the CD drive, and run **VBoxWindowsAdditions**.
3. Click through the installer with the defaults and reboot when asked.

## Rename the Computer to DC01

Windows picked a random name during install. Give it a real one:

1. Right-click the Start button and choose **System**.
2. Click **Rename this PC**.
3. Enter `DC01`, click **Next**, then restart.

## Assign a Static IP Address

Servers that provide network services need an address that never changes. DC01 will be your DNS and DHCP server, so every other machine in the lab has to know exactly where to find it.

1. Right-click the Start button and choose **Network Connections**.
2. Click **Ethernet**, then under IP assignment click **Edit**.
3. Change from Automatic (DHCP) to **Manual**, turn on **IPv4**, and enter:
   - **IP address:** `10.0.10.10`
   - **Subnet mask:** `255.255.255.0` (if asked for prefix length instead, enter `24`)
   - **Gateway:** `10.0.10.1`
   - **Preferred DNS:** `8.8.8.8`
4. Click **Save**.

The DNS setting is temporary. When DC01 becomes a domain controller in Module 4, it becomes its own DNS server and this changes.

To confirm it worked, open a Command Prompt and run:

```
ipconfig
```

You should see 10.0.10.10 as the IPv4 address. Then test the internet:

```
ping google.com
```

If you get replies, networking is done.

## Run Windows Update

1. Open **Settings > Windows Update** and click **Check for updates**.
2. Install everything, reboot when asked, and check again. Repeat until no updates remain.

This can take a long time, especially on slower hardware, but a patched server is worth it and you only have to do this big catch-up once.

## Take Your First Snapshot

A snapshot saves the VM's exact state so you can return to it if something breaks later.

1. Shut down DC01 from inside Windows (Start > Power > Shut down).
2. In VirtualBox Manager, select DC01, click the menu icon next to it, and choose **Snapshots**.
3. Click **Take** and name it `Clean install - before ADDS`.

If anything goes wrong in Module 4, you can restore this snapshot instead of reinstalling Windows. Snapshots are covered in more detail in the appendix.

## Checklist Before Moving On

- [ ] DC01 boots to a Windows Server 2025 desktop
- [ ] Guest Additions installed (window resizing works)
- [ ] Computer name is DC01
- [ ] `ipconfig` shows 10.0.10.10 and `ping google.com` works
- [ ] Windows Update shows no remaining updates
- [ ] Snapshot taken

Continue to Module 4 to install Active Directory and promote DC01 to a domain controller.
