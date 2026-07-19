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
- Activate the Windows Server evaluation
- Run Windows Update
- Take your first snapshot

## Create the Virtual Machine

1. In VirtualBox Manager, click **New**.
2. Fill in the first screen:
   - **Name:** `DC01`
   - **ISO Image:** browse to the Windows Server 2025 ISO from Module 1
   - Choose a manual installation. Depending on your VirtualBox version, either check **Skip Unattended Installation** or clear **Install OS Using Unattended Installation**. This prevents VirtualBox from selecting important Windows setup options for you.
3. Expand the **Hardware** section:
   - **Base Memory:** 4096 MB. If your host has only 8 GB of RAM, use 3072 MB and keep other applications closed while the VM runs.
   - **Processors:** 2
   - Check **Enable EFI**
4. Expand the **Hard Disk** section and set the size to **60 GB**. Leave it as a dynamically allocated VDI, which means the file starts small and grows as the VM uses space.
5. Click **Finish**. Do not start the VM yet.
6. Open **Settings > Display > Screen** and move the **Video Memory** slider to the maximum. This gives the Windows desktop more display memory and can make the interface feel smoother.

### Attach It to the Lab Network

1. Select DC01 and click **Settings > Network**.
2. On Adapter 1, set **Attached to: NAT Network** and **Name: ADLab**.
3. Click **OK**.

## Install Windows Server 2025

1. Start the VM. When you see "Press any key to boot from CD or DVD", click inside the VM window and press a key quickly. If you miss it, close the VM (Power off) and start it again.
2. Choose your language and keyboard settings.
3. Continue with **Install Windows Server**. On an older setup screen, this button may be labeled **Install Now**. If setup asks you to confirm that files, apps, and settings will be deleted, select the confirmation. This VM's new virtual disk is empty.
4. When asked to select an image, choose **Windows Server 2025 Standard Evaluation (Desktop Experience)**. The Desktop Experience part is essential for this guide because it installs the graphical interface and management tools used in later modules.
5. Accept the license terms. If setup asks which installation type you want, choose **Custom**.
6. Select the empty 60 GB drive and continue with the installation. Installation may be noticeably slower on an 8 GB host.
7. When prompted, set a password for the built-in Administrator account and store it securely. This guide uses that account for administrative work on DC01.

To log in, Windows asks for Ctrl+Alt+Del, but that key combo goes to your host instead of the VM. Use the VM window menu: **Input > Keyboard > Insert Ctrl-Alt-Del**.

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

The preferred DNS address is Google Public DNS and is temporary. When DC01 becomes a domain controller in Module 4, its network adapter will use DC01 itself for DNS.

To confirm the address, DNS, and outbound connectivity, open Command Prompt and run:

```text
ipconfig
ping google.com
```

`ipconfig` should show `10.0.10.10` as the IPv4 address, and `ping` should return replies. If it does not, recheck the static IP settings and confirm that Adapter 1 is attached to the ADLab NAT Network.

## Activate the Evaluation

Windows Server 2025 Evaluation lasts for 180 days, but Microsoft requires online activation within the first 10 days to avoid automatic shutdown. Now that DC01 has internet access, activate it explicitly instead of assuming automatic activation completed.

1. Search for **Command Prompt**, right-click it, and choose **Run as administrator**.
2. Request online activation:

```powershell
slmgr.vbs /ato
```

3. After Windows reports successful activation, display the evaluation expiration date:

```powershell
slmgr.vbs /xpr
```

The [evaluation-license appendix](/appendix/eval-rearm/) explains how to check the remaining time later and how to use Microsoft's supported rearm process when the evaluation period is nearly over.

## Run Windows Update

1. Open **Settings > Windows Update** and click **Check for updates**.
2. Install everything, reboot when asked, and check again. Repeat until no updates remain.

This may require several download, installation, and restart cycles, especially on slower hardware. Continue checking until Windows reports that the server is up to date.

## Take Your First Snapshot

A snapshot saves the VM's exact state so you can return to it if something breaks later.

1. Shut down DC01 from inside Windows (Start > Power > Shut down).
2. In VirtualBox Manager, select DC01 and open **Snapshots**. Depending on the Manager layout, this may appear as a tool or in the menu next to the VM.
3. Click **Take** and name it `Clean install - before AD DS`.

If anything goes wrong in Module 4, you can restore this snapshot instead of reinstalling Windows. The [Snapshot Strategy appendix](/appendix/snapshots/) explains restoration, disk usage, and why snapshots are not backups.

## Further Learning

These optional references provide more detail from the organizations that maintain VirtualBox and Windows Server:

- [Creating a New Virtual Machine](https://docs.oracle.com/en/virtualization/virtualbox/7.2/user/create-vm.html) explains VirtualBox's manual and unattended workflows, resource allocation, dynamic disks, and EFI setting.
- [Slmgr.vbs Options](https://learn.microsoft.com/en-us/windows-server/get-started/activation-slmgr-vbs-options) explains Microsoft's built-in activation and license-status commands.

## Checklist Before Moving On

- [ ] DC01 boots to a Windows Server 2025 desktop
- [ ] Guest Additions installed (window resizing works)
- [ ] Computer name is DC01
- [ ] `ipconfig` shows 10.0.10.10 and `ping google.com` returns replies
- [ ] Windows Server evaluation is activated
- [ ] Windows Update shows no remaining updates
- [ ] Snapshot taken

Continue to Module 4 to install Active Directory and promote DC01 to a domain controller.
