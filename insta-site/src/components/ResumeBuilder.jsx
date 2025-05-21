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

  const [order, setOrder] = useState(['education','experience','projects','skills']);

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
    const input = document.getElementById('resume-preview');
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ unit: 'px', format: 'a4' });
    pdf.addImage(imgData, 'PNG', 0, 0, 595, canvas.height * 595 / canvas.width);
    pdf.save('resume.pdf');
  };

  return (
    <div className="py-12 max-w-5xl mx-auto px-4">
      {/* Input Form */}
      <section className="mb-8 p-6 bg-gray-50 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Enter Your Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Full Name" value={data.name} onChange={handleBasic} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
          <input name="location" placeholder="Location" value={data.location} onChange={handleBasic} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
          <input name="email" type="email" placeholder="Email" value={data.email} onChange={handleBasic} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
          <input name="phone" placeholder="Phone" value={data.phone} onChange={handleBasic} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
          <input name="linkedin" placeholder="LinkedIn URL" value={data.linkedin} onChange={handleBasic} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
          <input name="github" placeholder="GitHub URL" value={data.github} onChange={handleBasic} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
        </div>
      </section>
      <h2 className="text-2xl font-bold mb-4 text-googleBlueDark text-center">Resume Builder</h2>
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold">Education</h3>
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
        <div>
          <h3 className="font-semibold">Skills</h3>
          {data.skills.map((sk,i)=>(
            <div key={i} className="flex items-center space-x-2 mb-2">
              <input placeholder="Skill" value={sk.skill} onChange={e=>handleArray('skills',i,'skill',e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
              {i>0 && <button onClick={()=>removeItem('skills',i)} className="text-red-500">Remove</button>}
            </div>
          ))}
          <button onClick={()=>addItem('skills')} className="mt-2 px-3 py-1 bg-googleGreen text-white rounded">Add Skill</button>
        </div>
        <div>
          <h3 className="font-semibold">Experience</h3>
          {data.experience.map((ex,i)=>(
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input placeholder="Position" value={ex.position} onChange={e=>handleArray('experience',i,'position',e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
              <input placeholder="Company" value={ex.company} onChange={e=>handleArray('experience',i,'company',e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
              <input placeholder="Dates" value={ex.dates} onChange={e=>handleArray('experience',i,'dates',e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
              <input placeholder="Location" value={ex.location} onChange={e=>handleArray('experience',i,'location',e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
              <textarea placeholder="Details" value={ex.details} onChange={e=>handleArray('experience',i,'details',e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring col-span-2" />
              {i>0 && <button onClick={()=>removeItem('experience',i)} className="text-red-500">Remove</button>}
            </div>
          ))}
          <button onClick={()=>addItem('experience')} className="mt-2 px-3 py-1 bg-googleGreen text-white rounded">Add Experience</button>
        </div>
        <div>
          <h3 className="font-semibold">Projects</h3>
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
      {/* Preview Resume */}
      <div id="resume-preview" style={{ width: '595px', height: '842px' }} className="bg-white p-8 shadow mx-auto font-sans text-gray-900 text-xs overflow-hidden">
        <h1 className="text-2xl font-bold text-center mb-1">{data.name}</h1>
        <div className="flex flex-wrap justify-center items-center text-xs mb-4 space-x-2">
          {data.location && <span>{data.location}</span>}
          {data.email && <><span className="text-gray-400">|</span><span className="pl-1">{data.email}</span></>}
          {data.phone && <><span className="text-gray-400">|</span><span className="pl-1">{data.phone}</span></>}
          {data.linkedin && <><span className="text-gray-400">|</span><a href={data.linkedin} className="underline pl-1" target="_blank" rel="noopener noreferrer">LinkedIn</a></>}
          {data.github && <><span className="text-gray-400">|</span><a href={data.github} className="underline pl-1" target="_blank" rel="noopener noreferrer">GitHub</a></>}
        </div>
        {/* Sections */}
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b pb-1 mb-2">Education</h2>
          <div>
            {data.education.map((ed, i) => (
              <div key={i} className="pb-3 mb-3 border-b border-gray-200 last:border-b-0">
                <div className="flex justify-between items-center mb-1 w-full">
                  <span className="font-bold text-sm">{ed.institution}</span>
                  <span className="text-sm text-gray-600">{ed.dates}</span>
                </div>
                <div className="flex justify-between items-center mb-2 w-full">
                  <span className="text-sm">{ed.degree}</span>
                  <span className="text-sm text-gray-600">{ed.location}</span>
                </div>
                {ed.details && <ul className="list-disc list-inside text-xs pl-4 mt-1">{ed.details.split('\n').map((d, j) => <li key={j}>{d}</li>)}</ul>}
              </div>
            ))}
          </div>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b pb-1 mb-2">Work Experience</h2>
          <div>
            {data.experience.map((ex, i) => (
              <div key={i} className="pb-3 mb-3 border-b border-gray-200 last:border-b-0">
                <div className="flex justify-between items-center mb-1 w-full">
                  <span className="font-bold text-sm">{ex.company}</span>
                  <span className="text-sm text-gray-600">{ex.dates}</span>
                </div>
                <div className="flex justify-between items-center mb-2 w-full">
                  <span className="text-sm">{ex.position}</span>
                  <span className="text-sm text-gray-600">{ex.location}</span>
                </div>
                <ul className="list-disc list-inside text-xs pl-4 space-y-1">{ex.details.split('\n').map((d, j) => <li key={j}>{d}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b pb-1 mb-2">Projects</h2>
          <div>
            {data.projects.map((pr, i) => (
              <div key={i} className="pb-3 mb-3 border-b border-gray-200 last:border-b-0">
                <div className="flex justify-between items-center mb-2 w-full">
                  <span className="font-bold text-sm">{pr.title}</span>
                  <span className="text-sm text-gray-600">{pr.dates}</span>
                </div>
                <ul className="list-disc list-inside text-xs pl-4 space-y-1">{pr.description.split('\n').map((d, j) => <li key={j}>{d}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b pb-1 mb-2">Skills</h2>
          <ul className="list-disc list-inside text-xs pl-4">
            {data.skills.map((sk,i)=><li key={i}>{sk.skill}</li>)}
          </ul>
        </section>
      </div>
      <div className="text-center mt-6">
        <button onClick={downloadPDF} className="px-6 py-2 bg-googleBlue text-white rounded">Download PDF</button>
      </div>
    </div>
  );
}
