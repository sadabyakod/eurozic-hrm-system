
import React, { useState } from "react";
import EmployeeManagement from "./components/HRM/EmployeeManagement/EmployeeManagement";
import LeaveTracking from "./components/HRM/LeaveTracking/LeaveTracking";
import Payroll from "./components/HRM/Payroll/Payroll";
import Recruitment from "./components/HRM/Recruitment/Recruitment";
import PerformanceReviews from "./components/HRM/PerformanceReviews/PerformanceReviews";
import OfferLetter from "./components/HRM/OfferLetter/OfferLetter";
import companyLogo from "./assets/company-logo.jpeg";

function App(){
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'Employee Management', component: <EmployeeManagement /> },
    { label: 'Leave Tracking', component: <LeaveTracking /> },
    { label: 'Payroll', component: <Payroll /> },
    { label: 'Recruitment', component: <Recruitment /> },
    { label: 'Performance Reviews', component: <PerformanceReviews /> },
    { label: 'Offer Letters', component: <OfferLetter /> }
  ];

  return (
    <div style={{fontFamily: "Arial, sans-serif", minHeight: "100vh", background: "#f5f5f5"}}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "20px 0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Background Pattern */}
        <div style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "300px",
          height: "100%",
          background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"none\" stroke=\"rgba(255,255,255,0.1)\" stroke-width=\"1\"/></svg>') repeat",
          opacity: 0.3
        }}></div>
        
        <div style={{maxWidth: "1200px", margin: "0 auto", padding: "0 20px", position: "relative", zIndex: 1}}>
          <div style={{display: "flex", alignItems: "center", gap: "20px"}}>
            {/* Company Logo */}
            <div style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "4px solid rgba(255,255,255,0.4)",
              boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
              transition: "transform 0.3s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            >
              <img 
                src={companyLogo} 
                alt="Neurozic Software Solutions Pvt Ltd Logo" 
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </div>
            
            {/* Company Name and Title */}
            <div style={{flex: 1}}>
              <h1 style={{
                margin: 0, 
                fontSize: "2.8rem", 
                fontWeight: "300",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                letterSpacing: "0.5px"
              }}>
                Neurozic Software Solutions Pvt Ltd
              </h1>
              <p style={{
                margin: "8px 0 0 0", 
                opacity: 0.9,
                fontSize: "0.85rem",
                fontWeight: "300",
                textAlign: "right"
              }}>
                Empowering Ideas Through Technology
              </p>
              <p style={{
                margin: "5px 0 0 0", 
                opacity: 0.85,
                fontSize: "1.2rem",
                fontWeight: "400",
                fontStyle: "italic",
                color: "#f0f0f0",
                letterSpacing: "0.3px",
                textAlign: "left"
              }}>
                Human Resource Management Dashboard
              </p>
            </div>

            {/* User Info Section */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              padding: "10px 20px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "25px",
              backdropFilter: "blur(10px)"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: "600"
              }}>
                👤
              </div>
              <div>
                <div style={{fontSize: "14px", fontWeight: "600"}}>Admin User</div>
                <div style={{fontSize: "12px", opacity: 0.8}}>HR Manager</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        background: "white",
        borderBottom: "1px solid #e0e0e0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
      }}>
        <div style={{maxWidth: "1200px", margin: "0 auto", padding: "0 20px"}}>
          <div style={{display: "flex", overflowX: "auto"}}>
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                style={{
                  background: activeTab === index ? "#667eea" : "transparent",
                  color: activeTab === index ? "white" : "#666",
                  border: "none",
                  padding: "15px 25px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: activeTab === index ? "600" : "400",
                  borderBottom: activeTab === index ? "3px solid #667eea" : "3px solid transparent",
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap",
                  borderRadius: activeTab === index ? "5px 5px 0 0" : "0"
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== index) {
                    e.target.style.background = "#f0f0f0";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== index) {
                    e.target.style.background = "transparent";
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div style={{maxWidth: "1200px", margin: "0 auto", padding: "30px 20px"}}>
        <div style={{
          background: "white",
          borderRadius: "8px",
          padding: "30px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
          minHeight: "600px"
        }}>
          {tabs[activeTab].component}
        </div>
      </div>
    </div>
  );
}
export default App;
