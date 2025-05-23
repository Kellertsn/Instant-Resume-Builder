import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function ResumeBuilder() {
  const [data, setData] = useState({
    name: '',
    location: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    education: [ { institution: '', degree: '', dates: '', location: '', details: '' } ],
    skills: [ { skill: '' } ],
    experience: [ { position: '', company: '', dates: '', location: '', details: '' } ],
    projects: [ { title: '', dates: '', description: '' } ]
  });

  const [order, setOrder] = useState(['profile','education','skills','experience','projects']);
  const [showPreview, setShowPreview] = useState(false);

  const handleBasic = e => setData({ ...data, [e.target.name]: e.target.value });

  const handleArray = (section, idx, field, value) => {
    const arr = [...data[section]];
    arr[idx][field] = value;
    setData({ ...data, [section]: arr });
  };

  const addItem = section => {
    const blank = section === 'education'
      ? { institution: '', degree: '', dates: '', location: '', details: '' }
      : section === 'experience'
        ? { position: '', company: '', dates: '', location: '', details: '' }
      : section === 'projects'
        ? { title: '', dates: '', description: '' }
      : section === 'skills'
        ? { skill: '' }
      : {};
    setData({ ...data, [section]: [...data[section], blank] });
  };

  const removeItem = (section, idx) => {
    setData({ ...data, [section]: data[section].filter((_,i)=>i!==idx) });
  };

  const moveSection = (section, dir) => {
    setOrder(prev => {
      const idx = prev.indexOf(section);
      const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= prev.length) return prev;
      const newOrder = [...prev];
      [newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]];
      return newOrder;
    });
  };

  const downloadPDF = async () => {
    const needShow = !showPreview;
    if (needShow) setShowPreview(true);
    await new Promise(r => setTimeout(r, 100));
    const preview = document.getElementById('resume-preview');
    const canvas = await html2canvas(preview);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'px', 'a4');
    const imgWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save('resume.pdf');
    if (needShow) setShowPreview(false);
  };

  return (
    <div className="py-8 max-w-5xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Resume Builder</h1>
      <div className="flex justify-end items-center mb-4 space-x-4">
        <button onClick={() => setShowPreview(p => !p)} className="px-4 py-2 bg-googleBlue text-white rounded">
          {showPreview ? 'Show Form' : 'Show Preview'}
        </button>
        <button onClick={downloadPDF} className="px-6 py-2 bg-googleBlue text-white rounded">Download PDF</button>
      </div>
      {!showPreview ? (
        <div className="flex flex-col gap-6">
          {/* Profile */}
          <section style={{order: order.indexOf('profile')}} className="mb-8 p-6 bg-gray-50 rounded-lg shadow">
            <h3 className="text-xl font-semibold inline-flex items-center space-x-2 mb-2 whitespace-nowrap">
              <span>Profile</span>
              <button disabled={order[0]==='profile'} onClick={()=>moveSection('profile','up')} className="text-sm">↑</button>
              <button disabled={order[order.length-1]==='profile'} onClick={()=>moveSection('profile','down')} className="text-sm">↓</button>
            </h3>
            <hr className="border-t border-gray-300 mb-2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" placeholder="Full Name" value={data.name} onChange={handleBasic} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
              <input name="location" placeholder="Location" value={data.location} onChange={handleBasic} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
              <input name="email" type="email" placeholder="Email" value={data.email} onChange={handleBasic} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
              <input name="phone" placeholder="Phone" value={data.phone} onChange={handleBasic} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
              <input name="linkedin" placeholder="LinkedIn URL" value={data.linkedin} onChange={handleBasic} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
              <input name="github" placeholder="GitHub URL" value={data.github} onChange={handleBasic} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
            </div>
          </section>
          {/* Education */}
          <div style={{order: order.indexOf('education')}}>
            <h3 className="text-xl font-semibold inline-flex items-center space-x-2 mb-2 whitespace-nowrap">
              <span>Education</span>
              <button disabled={order[0]==='education'} onClick={()=>moveSection('education','up')} className="text-sm">↑</button>
              <button disabled={order[order.length-1]==='education'} onClick={()=>moveSection('education','down')} className="text-sm">↓</button>
            </h3>
            <hr className="border-t border-gray-300 mb-2" />
            {data.education.map((ed, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center w-full">
                  <input placeholder="Institution" value={ed.institution} onChange={e=>handleArray('education',i,'institution',e.target.value)} className="w-2/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
                  <input placeholder="Dates" value={ed.dates} onChange={e=>handleArray('education',i,'dates',e.target.value)} className="w-1/3 p-2 text-right border border-gray-300 rounded focus:outline-none focus:ring" />
                </div>
                <div className="flex justify-between items-center mb-1 w-full">
                  <input placeholder="Degree" value={ed.degree} onChange={e=>handleArray('education',i,'degree',e.target.value)} className="w-2/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
                  <input placeholder="Location" value={ed.location} onChange={e=>handleArray('education',i,'location',e.target.value)} className="w-1/3 p-2 text-right border border-gray-300 rounded focus:outline-none focus:ring" />
                </div>
                <textarea placeholder="Bullet points (one per line)" value={ed.details} onChange={e=>handleArray('education',i,'details',e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring" rows={3} />
                {i>0 && <button onClick={()=>removeItem('education',i)} className="text-red-500">Remove</button>}
              </div>
            ))}
            <button onClick={()=>addItem('education')} className="mt-2 px-3 py-1 bg-googleGreen text-white rounded">Add Education</button>
          </div>
          {/* Skills */}
          <div style={{order: order.indexOf('skills')}}>
            <h3 className="text-xl font-semibold inline-flex items-center space-x-2 mb-2 whitespace-nowrap">
              <span>Skills</span>
              <button disabled={order[0]==='skills'} onClick={()=>moveSection('skills','up')} className="text-sm">↑</button>
              <button disabled={order[order.length-1]==='skills'} onClick={()=>moveSection('skills','down')} className="text-sm">↓</button>
            </h3>
            <hr className="border-t border-gray-300 mb-2" />
            {data.skills.map((sk,i)=>(
              <div key={i} className="flex items-center space-x-2 mb-2">
                <input placeholder="Skill" value={sk.skill} onChange={e=>handleArray('skills',i,'skill',e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
                {i>0 && <button onClick={()=>removeItem('skills',i)} className="text-red-500">Remove</button>}
              </div>
            ))}
            <button onClick={()=>addItem('skills')} className="mt-2 px-3 py-1 bg-googleGreen text-white rounded">Add Skill</button>
          </div>
          {/* Experience */}
          <div style={{order: order.indexOf('experience')}}>
            <h3 className="text-xl font-semibold inline-flex items-center space-x-2 mb-2 whitespace-nowrap">
              <span>Experience</span>
              <button disabled={order[0]==='experience'} onClick={()=>moveSection('experience','up')} className="text-sm">↑</button>
              <button disabled={order[order.length-1]==='experience'} onClick={()=>moveSection('experience','down')} className="text-sm">↓</button>
            </h3>
            <hr className="border-t border-gray-300 mb-2" />
            {data.experience.map((ex,i)=>(
              <div key={i} className="mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input placeholder="Position" value={ex.position} onChange={e=>handleArray('experience',i,'position',e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
                  <input placeholder="Company" value={ex.company} onChange={e=>handleArray('experience',i,'company',e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
                  <input placeholder="Dates" value={ex.dates} onChange={e=>handleArray('experience',i,'dates',e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
                  <input placeholder="Location" value={ex.location} onChange={e=>handleArray('experience',i,'location',e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
                </div>
                <textarea placeholder="Details" value={ex.details} onChange={e=>handleArray('experience',i,'details',e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring mb-2" rows={3}/>
                {i>0 && <button onClick={()=>removeItem('experience',i)} className="text-red-500">Remove</button>}
              </div>
            ))}
            <button onClick={()=>addItem('experience')} className="mt-2 px-3 py-1 bg-googleGreen text-white rounded">Add Experience</button>
          </div>
          {/* Projects */}
          <div style={{order: order.indexOf('projects')}}>
            <h3 className="text-xl font-semibold inline-flex items-center space-x-2 mb-2 whitespace-nowrap">
              <span>Projects</span>
              <button disabled={order[0]==='projects'} onClick={()=>moveSection('projects','up')} className="text-sm">↑</button>
              <button disabled={order[order.length-1]==='projects'} onClick={()=>moveSection('projects','down')} className="text-sm">↓</button>
            </h3>
            <hr className="border-t border-gray-300 mb-2" />
            {data.projects.map((pr,i)=>(
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center w-full">
                  <input placeholder="Title" value={pr.title} onChange={e=>handleArray('projects',i,'title',e.target.value)} className="w-2/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
                  <input placeholder="Dates" value={pr.dates} onChange={e=>handleArray('projects',i,'dates',e.target.value)} className="w-1/3 p-2 text-right border border-gray-300 rounded focus:outline-none focus:ring" />
                </div>
                <textarea placeholder="Description (one per line)" value={pr.description} onChange={e=>handleArray('projects',i,'description',e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring" rows={3} />
                {i>0 && <button onClick={()=>removeItem('projects',i)} className="text-red-500">Remove</button>}
              </div>
            ))}
            <button onClick={()=>addItem('projects')} className="mt-2 px-3 py-1 bg-googleGreen text-white rounded">Add Project</button>
          </div>
        </div>
      ) : (
        <div id="resume-preview-wrapper" className="overflow-auto mx-auto" style={{ width: '595px', height: '842px' }}>
          <div id="resume-preview" className="bg-white p-8 shadow font-sans text-gray-900 text-xs">
            {order.map(sectionKey => {
              switch (sectionKey) {
                case 'profile':
                  return (
                    <section key="profile" className="mb-6">
                      <h1 className="text-2xl font-semibold text-center mb-2">{data.name}</h1>
                      <div className="flex flex-wrap justify-center items-center text-xs mb-4">
                        {data.location && <span>{data.location}</span>}
                        {data.email && <><span className="px-2 text-gray-400">|</span><span>{data.email}</span></>}
                        {data.phone && <><span className="px-2 text-gray-400">|</span><span>{data.phone}</span></>}
                        {data.linkedin && <><span className="px-2 text-gray-400">|</span><a href={data.linkedin} className="underline" target="_blank" rel="noopener noreferrer">LinkedIn</a></>}
                        {data.github && <><span className="px-2 text-gray-400">|</span><a href={data.github} className="underline" target="_blank" rel="noopener noreferrer">GitHub</a></>}
                      </div>
                    </section>
                  );
                case 'education':
                  return (
                    <section key="education" className="mb-6">
                      <h2 className="text-xl font-semibold uppercase mb-2">Education</h2>
                      <hr className="border-t border-gray-300 mb-2" />
                      {data.education.map((ed, i) => (
                        <div key={i} className="pb-3 mb-3 border-b border-gray-200 last:border-b-0">
                          <div className="flex justify-between items-center w-full mb-2">
                            <span className="font-bold text-sm">{ed.institution}</span>
                            <span className="text-sm text-gray-600 ml-auto pl-4">{ed.dates}</span>
                          </div>
                          <div className="flex justify-between items-center w-full mb-3">
                            <span className="text-sm">{ed.degree}</span>
                            <span className="text-sm text-gray-600 ml-auto pl-4">{ed.location}</span>
                          </div>
                          {ed.details && (
                            <ul className="list-disc list-inside text-xs pl-4 space-y-1">
                              {ed.details.split('\n').map((d, j) => <li key={j}>{d}</li>)}
                            </ul>
                          )}
                        </div>
                      ))}
                    </section>
                  );
                case 'skills':
                  return (
                    <section key="skills" className="mb-6">
                      <h2 className="text-xl font-semibold uppercase mb-2">Skills</h2>
                      <hr className="border-t border-gray-300 mb-2" />
                      {data.skills.length > 0 && (
                        <ul className="list-disc list-inside text-xs pl-4 space-y-1">
                          {data.skills.map((sk, i) => <li key={i}>{sk.skill}</li>)}
                        </ul>
                      )}
                    </section>
                  );
                case 'experience':
                  return (
                    <section key="experience" className="mb-6">
                      <h2 className="text-xl font-semibold uppercase mb-2">Experience</h2>
                      <hr className="border-t border-gray-300 mb-2" />
                      {data.experience.map((ex, i) => (
                        <div key={i} className="pb-3 mb-3 border-b border-gray-200 last:border-b-0">
                          <div className="flex justify-between items-center w-full mb-2">
                            <span className="font-bold text-sm">{ex.company}</span>
                            <span className="text-sm text-gray-600">{ex.dates}</span>
                          </div>
                          <div className="flex justify-between items-center w-full mb-2">
                            <span className="text-sm">{ex.position}</span>
                            <span className="text-sm text-gray-600">{ex.location}</span>
                          </div>
                          {ex.details && (
                            <ul className="list-disc list-inside text-xs pl-4 space-y-1">
                              {ex.details.split('\n').map((d, j) => <li key={j}>{d}</li>)}
                            </ul>
                          )}
                        </div>
                      ))}
                    </section>
                  );
                case 'projects':
                  return (
                    <section key="projects" className="mb-6">
                      <h2 className="text-xl font-semibold uppercase mb-2">Projects</h2>
                      <hr className="border-t border-gray-300 mb-2" />
                      {data.projects.map((pr, i) => (
                        <div key={i} className="pb-3 mb-3 border-b border-gray-200 last:border-b-0">
                          <div className="flex justify-between items-center w-full mb-2">
                            <span className="font-bold text-sm">{pr.title}</span>
                            <span className="text-sm text-gray-600">{pr.dates}</span>
                          </div>
                          {pr.description && (
                            <ul className="list-disc list-inside text-xs pl-4 space-y-1">
                              {pr.description.split('\n').map((d, j) => <li key={j}>{d}</li>)}
                            </ul>
                          )}
                        </div>
                      ))}
                    </section>
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
}
