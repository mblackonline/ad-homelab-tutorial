---
title: "Module 5: DHCP"
description: Make your Domain Controller hand out IP addresses to the rest of the lab.
---

Back in Module 2 you turned off VirtualBox's built-in DHCP. In this module, DC01 takes over that job, exactly like a Windows server would in a real office. When you build CLIENT01 in Module 6, it will get its address automatically from DC01.

## In This Module

- Install the DHCP Server role
- Authorize the DHCP server in Active Directory
- Create a scope for the lab network
- Configure the scope to point clients at your DC for DNS

## What DHCP Does

DHCP hands out IP addresses so you do not have to configure every machine by hand. When a computer joins the network, it broadcasts "I need an address," and the DHCP server replies with an address plus the other settings the machine needs: subnet mask, gateway, and which DNS server to use. That last one matters most in this lab. Clients must use DC01 for DNS, or they will never find the domain.

## Install the DHCP Server Role

1. On DC01, open **Server Manager** and click **Manage > Add Roles and Features**.
2. Click Next through to the Server Roles screen, check **DHCP Server**, and click **Add Features** when prompted.
3. Click Next through the rest and click **Install**.

## Authorize the DHCP Server

Active Directory keeps a list of approved DHCP servers so a rogue or accidental server cannot hand out bad addresses on a company network. Yours needs to be added to that list.

1. In Server Manager, click the **yellow warning flag** and choose **Complete DHCP configuration**.
2. Click Next, leave the default credentials (you are logged in as the domain Administrator, which is exactly who can authorize), and click **Commit**.
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
5. **Exclusions:** leave empty and click Next. The range already avoids DC01's address at 10.0.10.10, which is why the pool starts at .100. Static servers live low in the range, DHCP clients live high, and they can never collide.
6. **Lease Duration:** keep the default (8 days) and click Next.
7. Choose **Yes, I want to configure these options now** and click Next.
8. **Router (Default Gateway):** enter `10.0.10.1`, click **Add**, then Next.
9. **Domain Name and DNS Servers:** the parent domain should already say `lab.internal`, and `10.0.10.10` should already be listed as a DNS server. If not, enter them. Click Next.
10. **WINS Servers:** leave empty and click Next. WINS is an obsolete service you will never use.
11. Choose **Yes, I want to activate this scope now**, click Next, then Finish.

The scope is now live. In the DHCP console, IPv4 should show a green check mark, and the scope's **Address Leases** folder will be empty until Module 6, when CLIENT01 requests its first address.

:::note
There is nothing on the network to hand addresses to yet, so a real test has to wait for CLIENT01. That is the very first thing Module 6 confirms.
:::

## Take a Snapshot

Shut down DC01 and take a snapshot named `DHCP configured`. This completes the server side of the lab, so it is a good state to be able to return to.

## Checklist Before Moving On

- [ ] DHCP console shows IPv4 with a green check mark
- [ ] Scope Lab Network exists, range 10.0.10.100 to 10.0.10.200, and is active
- [ ] Scope options show router 10.0.10.1 and DNS server 10.0.10.10
- [ ] Snapshot taken

Continue to Module 6 to build CLIENT01 and join it to the domain.
