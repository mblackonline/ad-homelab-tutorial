---
title: "Module 6: Build and Join CLIENT01"
description: Build a Windows 11 client machine and join it to your new domain.
---

Time to give the domain its first member. In this module you build a Windows 11 machine, watch it pick up an address from your DHCP server, and join it to `lab.internal`.

## In This Module

- Create the CLIENT01 virtual machine with TPM 2.0 and Secure Boot enabled
- Install Windows 11 Enterprise with a local account
- Confirm CLIENT01 received its IP address from your DHCP server
- Join CLIENT01 to the domain
- Log in with a domain account
- Take a snapshot

## Create the Virtual Machine

Windows 11 is pickier than Windows Server. It refuses to install without a TPM 2.0 chip and Secure Boot, so this VM needs both. VirtualBox can emulate them.

1. In VirtualBox Manager, click **New**.
2. Fill in the first screen:
   - **Name:** `CLIENT01`
   - **ISO Image:** browse to the Windows 11 Enterprise ISO from Module 1
   - Check **Skip Unattended Installation**
3. Expand the **Hardware** section:
   - **Base Memory:** 4096 MB
   - **Processors:** 2
   - Check **Enable EFI**
4. Expand the **Hard Disk** section and set the size to **64 GB** (the Windows 11 minimum). Click **Finish**.
5. Before starting the VM, open **Settings > System** and confirm on the Motherboard tab:
   - **TPM:** v2.0
   - **Enable Secure Boot:** checked (this option only appears when EFI is enabled)

   VirtualBox usually sets these automatically when it recognizes a Windows 11 ISO, but verify. If either is missing, the installer will refuse to run.
6. Open **Settings > Display > Screen** and move the **Video Memory** slider to the maximum. This gives the Windows desktop more display memory and can make the interface feel smoother.
7. Go to **Settings > Network** and set Adapter 1 to **NAT Network**, name **ADLab**. Click OK.

:::note
Make sure DC01 is running before you start CLIENT01, and keep it running for the rest of this module. CLIENT01 depends on it for its IP address, DNS, and the domain itself.

If your host has only 8 GB of RAM, running both VMs at 4096 MB each will not fit. Set both DC01 and CLIENT01 to 3072 MB (Settings > System, while each VM is powered off) and expect things to be slow.
:::

## Install Windows 11

1. Start CLIENT01 and press a key when prompted to boot from the ISO.
2. Choose language and keyboard, then continue through the install. The evaluation does not ask for a product key.
3. Choose the **Custom** install option, select the empty drive, and let the install run.
4. After the reboots, Windows setup asks for your country and keyboard, then connects to the network.
5. When you reach the sign-in step, do not use a Microsoft account. Look for **Sign-in options**, then choose **Domain join instead**. Despite the name, it does not join a domain. It just lets you create a local account.
6. Create a local user (for example `localadmin`) with a password you will remember, answer the security questions, and decline the optional privacy toggles if you want. Windows finishes setup and lands on the desktop.

### Install Guest Additions

Same as on DC01: **Devices > Insert Guest Additions CD image**, run **VBoxWindowsAdditions** from the CD drive in File Explorer, accept the defaults, and reboot.

## Confirm DHCP Worked

This is the payoff from Module 5. Open a Command Prompt and run:

```
ipconfig /all
```

Check three things in the Ethernet adapter section:

- **IPv4 Address:** somewhere between 10.0.10.100 and 10.0.10.200
- **DHCP Server:** 10.0.10.10
- **DNS Servers:** 10.0.10.10

That address came from DC01. You can see the other side of the transaction on DC01: open the DHCP console, expand the scope, and click **Address Leases**. CLIENT01's lease is listed there.

If the address starts with 169.254 instead, the machine got no DHCP response. Check that DC01 is running and that both VMs are attached to the ADLab network, then run `ipconfig /renew`.

## Join the Domain

You will rename the computer and join the domain in one step.

1. Press Win + R, type `sysdm.cpl`, and press Enter.
2. On the Computer Name tab, click **Change**.
3. Set **Computer name** to `CLIENT01`.
4. Select **Member of: Domain** and enter `lab.internal`.
5. Click OK. When asked for an account with permission to join, enter `LAB\Administrator` and the DC01 Administrator password.
6. A "Welcome to the lab.internal domain" message appears. Click OK, then restart when prompted.

If you get an error instead, the cause is almost always DNS. Run `ipconfig /all` and confirm the DNS server is 10.0.10.10 and nothing else.

## Log In with a Domain Account

The login screen still offers your local account, but now the machine also accepts domain accounts.

1. On the login screen, click **Other user**.
2. Sign in as `LAB\Administrator` with the DC01 Administrator password.

The first login takes a minute while Windows builds the profile. To prove you are on the domain, open a Command Prompt and run:

```
whoami
```

It returns `lab\administrator`. You are logged in to CLIENT01 with an account that lives on DC01. That is Active Directory doing its job.

Using the domain Administrator on a client is fine for this lab, but it is not how real environments work. In Module 7 you will create normal user accounts, and those are what you will log in with from then on.

## Take a Snapshot

Shut down CLIENT01 and take a snapshot named `Domain joined`. Take a fresh one on DC01 too if you skipped it after Module 5.

## Checklist Before Moving On

- [ ] CLIENT01 got an address in the 10.0.10.100 to 10.0.10.200 range from DC01
- [ ] CLIENT01's lease appears in the DHCP console on DC01
- [ ] CLIENT01 is joined to lab.internal
- [ ] `whoami` after a domain login returns lab\administrator
- [ ] Snapshot taken

Continue to Module 7 to create the users, groups, and folder structure of a small company.
