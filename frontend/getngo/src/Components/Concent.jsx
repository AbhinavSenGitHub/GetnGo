import React from 'react'
import { Link } from 'react-router-dom';
const Aggrement = ({ isOpen, onAgree, onClose }) => {
    return (
      <div className="concent-div">
        <p>Implementing user registration on your website is a standard practice that allows users to create accounts, enabling personalized experiences and secure access to your services. During this process, users typically provide essential information such as their email address, password, and phone number. While collecting email addresses and phone numbers aids communication and account recovery, it's crucial to prioritize user privacy and security. Employ robust encryption techniques to safeguard sensitive data like passwords and adopt best practices like salting and hashing to protect against unauthorized access. Additionally, ensure compliance with relevant data protection regulations, such as GDPR or CCPA, by obtaining explicit consent and offering transparent information about data usage. Striking a balance between user convenience and data protection fosters trust, encouraging users to engage with your platform confidently.</p>
        <Link className="button" to="/signIn">Aggred</Link>
      </div>
    );
  };
  
  export default Aggrement;
