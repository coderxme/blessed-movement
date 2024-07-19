import { IoSearchOutline } from "react-icons/io5";
import { Modal,  List , Input, Button } from 'antd';
import { useState } from "react";
import { HashLink as Link } from 'react-router-hash-link';


// Sample data for suggestions with IDs
const sampleData = [
    { id: 'about', name: 'About', path: 'about' },
    { id: 'mission-vision', name: 'Mission and Vision', path: 'about' },
    { id: 'programs-and-projects', name: 'Programs and Projects', path: 'programs-and-projects' },
    { id: 'link1', name: 'Training and Livelihood', path: 'programs-and-projects' },
    { id: 'link2', name: 'Nation Building Workshops: Embracing theVision of Bagong Pilipinas', path: 'programs-and-projects' },
    { id: 'link3', name: 'Blessed Movement Kapihan Forum: Promoting Dialogue on Current Issues', path: 'programs-and-projects' },
    { id: 'link4', name: 'Empowering Blessed Movement Members as Community Patrollers', path: 'programs-and-projects' },
    { id: 'link5', name: 'Parallel Groups for Community Development', path: 'programs-and-projects' },
    { id: 'link6', name: 'Community Outreach to Indigenous Peoples and Mission Areas', path: 'programs-and-projects' },
    { id: 'link7', name: 'Member Advocacy Action Team', path: 'programs-and-projects' },
    { id: 'link8', name: 'Train the Trainers Workshop: Enhancing Leadership Skills for Seminars and Recognition', path: 'programs-and-projects' },
    { id: 'news-and-articles', name: 'News & Articles', path: 'news-and-articles' },
    { id: 'link1', name: 'Contact Us', path: 'contact-us' },
    { id: 'link1', name: 'FREQUENTLY ASKED QUESTIONS about the BLESSED Movement', path: 'faq' },
 
  ];

export default function Search() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const sliceData = sampleData.slice(0, 10);
  
    const showModal = () => {
      setIsModalVisible(true);
      setFilteredSuggestions(sliceData);
    };
  
    const handleCancel = () => {
      setIsModalVisible(false);
      setSearchTerm('');
      setFilteredSuggestions([]);
    };
  
    const handleChange = (event) => {
      const value = event.target.value;
      setSearchTerm(value);
      if (value) {
        const filtered = sampleData.filter(item =>
          item.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSuggestions(filtered);
      } else {
        setFilteredSuggestions(sliceData);
      }
    };
  
    const handleLinkClick = () => {
      setIsModalVisible(false);
      setSearchTerm('');
    };
  
   return (
    <div className='searchBox'>
        <Button type="primary" onClick={showModal} icon={<IoSearchOutline    />}/>
        <Modal
            title='Search'
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            width={900}
    >
      <Input
        placeholder='Search...'
        value={searchTerm}
        onChange={handleChange}
      />
      {filteredSuggestions.length > 0 && (
        <List
        size="small"
        bordered
        dataSource={filteredSuggestions}
        renderItem={item => (
          <List.Item>
            <Link to={`${item.path}#${item.id}`} onClick={handleLinkClick}>{item.name}</Link>
          </List.Item>
        )}
        style={{ marginTop: 10 }}
      />
      )}
    </Modal>
   </div>
   )
}