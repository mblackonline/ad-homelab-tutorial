---
title: "Module 5: DHCP"
description: Make your Domain Controller hand out IP addresses to the rest of the lab.
---

Back in Module 2 you turned off VirtualBox's built-in DHCP. In this module, DC01 takes over that job using the DHCP Server role. Windows Server is one common way organizations provide DHCP, although routers and other network appliances can provide it too. When you build CLIENT01 in Module 6, it will get its address automatically from DC01.

## In This Module

- Install the DHCP Server role
- Authorize the DHCP server in Active Directory
- Create a scope for the lab network
- Configure the scope to point clients at your DC for DNS

## What DHCP Does

DHCP hands out IP addresses so you do not have to configure every machine by hand. When a computer joins the network, it asks for an address, and the DHCP server replies with an address plus the other settings the machine needs: subnet mask, gateway, and which DNS server to use. That last setting is especially important in this lab. Clients must use DC01 for DNS so they can find the domain and its services.

## Install the DHCP Server Role

1. On DC01, open **Server Manager** and click **Manage > Add Roles and Features**.
2. Click Next through to the Server Roles screen, check **DHCP Server**, and click **Add Features** when prompted.
3. Click Next through the rest and click **Install**.

## Authorize the DHCP Server

In an Active Directory domain, Windows DHCP servers must be added to the list of authorized servers before they can issue leases. DC01 needs to be added to that list.

1. In Server Manager, click the **yellow warning flag** and choose **Complete DHCP configuration**.
2. Click Next, leave the default credentials because you are signed in as the domain Administrator, and click **Commit**.
3. Click Close when it finishes.

## Create a Scope

A scope is the pool of addresses the server is allowed to hand out, plus the settings that come with them.

1. Open **Server Manager > Tools > DHCP**.
2. Expand **dc01.lab.internal**, right-click **IPv4**, and choose **New Scope**. A wizard opens.
3. **Name:** `Lab Network`. Description can stay empty.
4. **IP Address Range:**
   - Start: `10.0.10.100`
   - End: `10.0.10.200`
   - Length: `24` (the subnet mask fills in as 255.255.255.0)
5. **Exclusions:** leave empty and click Next. The pool starts at `.100`, so it already excludes DC01 at `10.0.10.10` and the VirtualBox gateway at `10.0.10.1`. Keeping this lab's planned static addresses outside the DHCP pool reduces the risk of duplicate addresses.
6. **Lease Duration:** keep the default (8 days) and click Next.
7. Choose **Yes, I want to configure these options now** and click Next.
8. **Router (Default Gateway):** enter `10.0.10.1`, click **Add**, then Next.
9. **Domain Name and DNS Servers:** the parent domain should already say `lab.internal`, and `10.0.10.10` should already be listed as a DNS server. If not, enter them. Click Next.
10. **WINS Servers:** leave empty and click Next. WINS is a legacy name-resolution service that this lab does not use.
11. Choose **Yes, I want to activate this scope now**, click Next, then Finish.

The scope is now live. In the DHCP console, IPv4 should show a green check mark. Expand the new scope and select **Scope Options**. Confirm these three entries:

- **003 Router:** `10.0.10.1`
- **006 DNS Servers:** `10.0.10.10`
- **015 DNS Domain Name:** `lab.internal`

The scope's **Address Leases** folder will remain empty until Module 6, when CLIENT01 requests its first address.

:::note
There is nothing on the network to hand addresses to yet, so a real test has to wait for CLIENT01. That is the very first thing Module 6 confirms.
:::

## Take a Snapshot

Shut down DC01 from inside Windows and take a snapshot named `DHCP configured`. This completes the server side of the lab, so it is a useful state to be able to restore.

## Further Learning

These optional references provide additional detail from Microsoft and the RFC Editor:

- [DHCP Server Overview](https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/dhcp-top) explains leases, options, reservations, authorization, DNS integration, and other Windows DHCP features.
- [Install and Configure DHCP Server](https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/quickstart-install-configure-dhcp-server) provides Microsoft's current graphical and PowerShell procedures for Windows Server 2025.
- [DHCP Scopes](https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/dhcp-scopes) explains address pools, exclusions, lease duration, reservations, and scope planning.
- [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/info/rfc2131/) defines how DHCP clients and servers exchange address information.

## Checklist Before Moving On

- [ ] DHCP console shows IPv4 with a green check mark
- [ ] Scope Lab Network exists, range 10.0.10.100 to 10.0.10.200, and is active
- [ ] Scope options show router 10.0.10.1, DNS server 10.0.10.10, and DNS domain lab.internal
- [ ] Snapshot taken

Continue to Module 6 to build CLIENT01 and join it to the domain.
