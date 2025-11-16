// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract WargaLapor {
    struct ReportEvent {
        uint256 reportId;
        string status;
        address actor;
        uint256 timestamp;
        string metaHash;
    }
    
    struct BantuanEvent {
        uint256 bantuanId;
        string jenisBantuan;
        uint256 nominal;
        address recipient;
        uint256 timestamp;
    }
    
    ReportEvent[] public reportEvents;
    BantuanEvent[] public bantuanEvents;
    
    event ReportEventCreated(
        uint256 indexed reportId,
        string status,
        address actor,
        uint256 timestamp,
        string metaHash
    );
    
    event BantuanEventCreated(
        uint256 indexed bantuanId,
        string jenisBantuan,
        uint256 nominal,
        address recipient,
        uint256 timestamp
    );
    
    function logReportEvent(
        uint256 reportId,
        string memory status,
        string memory metaHash
    ) public {
        ReportEvent memory newEvent = ReportEvent({
            reportId: reportId,
            status: status,
            actor: msg.sender,
            timestamp: block.timestamp,
            metaHash: metaHash
        });
        
        reportEvents.push(newEvent);
        
        emit ReportEventCreated(
            reportId,
            status,
            msg.sender,
            block.timestamp,
            metaHash
        );
    }
    
    function logBantuanEvent(
        uint256 bantuanId,
        string memory jenisBantuan,
        uint256 nominal,
        address recipient
    ) public {
        BantuanEvent memory newEvent = BantuanEvent({
            bantuanId: bantuanId,
            jenisBantuan: jenisBantuan,
            nominal: nominal,
            recipient: recipient,
            timestamp: block.timestamp
        });
        
        bantuanEvents.push(newEvent);
        
        emit BantuanEventCreated(
            bantuanId,
            jenisBantuan,
            nominal,
            recipient,
            block.timestamp
        );
    }
    
    function getReportEvents(uint256 reportId) public view returns (ReportEvent[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < reportEvents.length; i++) {
            if (reportEvents[i].reportId == reportId) {
                count++;
            }
        }
        
        ReportEvent[] memory events = new ReportEvent[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < reportEvents.length; i++) {
            if (reportEvents[i].reportId == reportId) {
                events[index] = reportEvents[i];
                index++;
            }
        }
        
        return events;
    }
}

