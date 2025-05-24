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
    education: [ { institution: '', degree: '', dates: '', location: '', details: [''] } ],
    skills: [ { skill: '' } ],
    experience: [ { position: '', company: '', dates: '', location: '', details: [''] } ],
    projects: [ { title: '', dates: '', description: [''] } ]
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
      ? { institution: '', degree: '', dates: '', location: '', details: [''] }
      : section === 'experience'
        ? { position: '', company: '', dates: '', location: '', details: [''] }
      : section === 'projects'
        ? { title: '', dates: '', description: [''] }
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

  const handleBulletChange = (section, idx, bIdx, value, field='details') => {
    const arr = [...data[section]];
    const items = Array.isArray(arr[idx][field]) ? [...arr[idx][field]] : [arr[idx][field]];
    items[bIdx] = value;
    arr[idx][field] = items;
    setData({ ...data, [section]: arr });
  };

  const addBullet = (section, idx, field='details') => {
    const arr = [...data[section]];
    const items = Array.isArray(arr[idx][field]) ? [...arr[idx][field], ''] : [arr[idx][field], ''];
    arr[idx][field] = items;
    setData({ ...data, [section]: arr });
  };

  const removeBullet = (section, idx, bIdx, field='details') => {
    const arr = [...data[section]];
    const items = Array.isArray(arr[idx][field]) ? arr[idx][field].filter((_,i)=>i!==bIdx) : [];
    arr[idx][field] = items;
    setData({ ...data, [section]: arr });
  };

  const downloadPDF = async () => {
    const needShow = !showPreview;
    if (needShow) setShowPreview(true);
    await new Promise(r => setTimeout(r, 100));
    document.querySelectorAll('.controls').forEach(el => el.style.visibility = 'hidden');
    const pdf = new jsPDF('p', 'px', 'a4');
    // apply custom margins from Word (in inches → px at 96dpi)
    const margins = { top: 0.15 * 96, right: 0.2 * 96, bottom: 0.19 * 96, left: 0.2 * 96 };
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    // ensure correct container width for wrapping
    const preview = document.getElementById('resume-preview');
    preview.style.width = `${pageWidth - margins.left - margins.right}px`;
    preview.style.margin = '0';
    preview.style.padding = '0';
    await new Promise(resolve => {
      pdf.html(document.getElementById('resume-preview'), {
        x: margins.left,
        y: margins.top,
        width: pageWidth - margins.left - margins.right,
        html2canvas: { scale: 1 },
        callback: () => {
          // add clickable link annotations
          const container = document.getElementById('resume-preview');
          const containerRect = container.getBoundingClientRect();
          container.querySelectorAll('a').forEach(a => {
            const rect = a.getBoundingClientRect();
            pdf.link(
              margins.left + rect.left - containerRect.left,
              margins.top + rect.top - containerRect.top,
              rect.width,
              rect.height,
              { url: a.href }
            );
          });
          pdf.save('resume.pdf');
          document.querySelectorAll('.controls').forEach(el => el.style.visibility = 'visible');
          if (needShow) setShowPreview(false);
          resolve();
        }
      });
    });
  };

  return (
    <>
      <style>{`
        /* avoid page breaks and base styling */
        #resume-preview section {
          page-break-inside: avoid;
          break-inside: avoid;
          margin-bottom: 0.5rem;
          font-family: 'Times New Roman';
          font-size: 8.8px;
        }
        /* container fills wrapper; no extra padding */
        #resume-preview {
          width: 100%;
          margin: 0;
          padding: 0;
        }
        /* headings */
        #resume-preview h1 {
          font-family: Arial;
          font-size: 12.4px;
          font-weight: bold;
          margin: 0;
          padding: 0;
        }
        #resume-preview h2 {
          font-family: Arial;
          font-size: 10.4px;
          font-weight: bold;
          margin: 0;
          padding: 0;
        }
        /* horizontal rule styling */
        #resume-preview hr {
          border: none;
          border-top: 1px solid #000;
          margin: 0;
        }
        /* no gap under hr */
        #resume-preview hr + div {
          margin-top: 0;
        }
        /* spacing between entries in the same section */
        #resume-preview section > div + div {
          margin-top: 0.5rem;
        }
        /* profile contact line flush under name, single line */
        #resume-preview h1 + .contact-info,
        #resume-preview .contact-info {
          margin: 0;
          white-space: nowrap;
        }
        /* separator line directly under headings */
        #resume-preview h2 + hr {
          margin: 0;
        }
        /* link styling */
        #resume-preview a {
          font-weight: normal;
          text-decoration: none;
          color: #000;
          cursor: pointer;
        }
        #resume-preview a:hover {
          opacity: 0.8;
        }
        /* remove indent on bullets */
        #resume-preview ul {
          padding-left: 0;
          margin-left: 0;
        }
        /* remove underline for contact links */
        #resume-preview .contact-info a {
          text-decoration: none;
        }
      `}</style>
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
              <h3 className="text-xl font-semibold mb-2">Profile</h3>
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
              <h3 className="text-xl font-semibold mb-2">Education</h3>
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
                  {ed.details.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start space-x-2 mb-2">
                      <span className="text-lg pt-2">•</span>
                      <textarea placeholder="Bullet point" value={bullet} onChange={e=>handleBulletChange('education',i,bIdx,e.target.value)} rows={2} wrap="soft" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring resize-none whitespace-pre-wrap" />
                      {ed.details.length>1 && <button onClick={()=>removeBullet('education',i,bIdx)} className="text-red-500">×</button>}
                    </div>
                  ))}
                  <button onClick={()=>addBullet('education',i)} className="mt-1 px-2 py-1 bg-googleGreen text-white rounded text-xs">Add Bullet</button>
                  {i>0 && <button onClick={()=>removeItem('education',i)} className="text-red-500">Remove</button>}
                </div>
              ))}
              <button onClick={()=>addItem('education')} className="mt-2 px-3 py-1 bg-googleGreen text-white rounded">Add Education</button>
            </div>
            {/* Skills */}
            <div style={{order: order.indexOf('skills')}}>
              <h3 className="text-xl font-semibold mb-2">Skills</h3>
              <hr className="border-t border-gray-300 mb-2" />
              {data.skills.map((sk,i)=>(
                <div key={i} className="flex items-start space-x-2 mb-2">
                  <span className="text-lg pt-2">•</span>
                  <textarea placeholder="Bullet point" value={sk.skill} onChange={e=>handleArray('skills',i,'skill',e.target.value)} rows={2} wrap="soft" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring resize-none whitespace-pre-wrap" />
                  {i>0 && <button onClick={()=>removeItem('skills',i)} className="text-red-500">Remove</button>}
                </div>
              ))}
              <button onClick={()=>addItem('skills')} className="mt-2 px-3 py-1 bg-googleGreen text-white rounded">Add Skill</button>
            </div>
            {/* Experience */}
            <div style={{order: order.indexOf('experience')}}>
              <h3 className="text-xl font-semibold mb-2">Experience</h3>
              <hr className="border-t border-gray-300 mb-2" />
              {data.experience.map((ex,i)=>(
                <div key={i} className="mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input placeholder="Position" value={ex.position} onChange={e=>handleArray('experience',i,'position',e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
                    <input placeholder="Company" value={ex.company} onChange={e=>handleArray('experience',i,'company',e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
                    <input placeholder="Dates" value={ex.dates} onChange={e=>handleArray('experience',i,'dates',e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
                    <input placeholder="Location" value={ex.location} onChange={e=>handleArray('experience',i,'location',e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
                  </div>
                  {ex.details.map((bullet,bIdx)=>(
                    <div key={bIdx} className="flex items-start space-x-2 mb-2">
                      <span className="text-lg pt-2">•</span>
                      <textarea placeholder="Bullet point" value={bullet} onChange={e=>handleBulletChange('experience',i,bIdx,e.target.value)} rows={2} wrap="soft" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring resize-none whitespace-pre-wrap" />
                      {ex.details.length>1 && <button onClick={()=>removeBullet('experience',i,bIdx)} className="text-red-500">×</button>}
                    </div>
                  ))}
                  <button onClick={()=>addBullet('experience',i)} className="mt-1 px-2 py-1 bg-googleGreen text-white rounded text-xs">Add Bullet</button>
                  {i>0 && <button onClick={()=>removeItem('experience',i)} className="text-red-500">Remove</button>}
                </div>
              ))}
              <button onClick={()=>addItem('experience')} className="mt-2 px-3 py-1 bg-googleGreen text-white rounded">Add Experience</button>
            </div>
            {/* Projects */}
            <div style={{order: order.indexOf('projects')}}>
              <h3 className="text-xl font-semibold mb-2">Projects</h3>
              <hr className="border-t border-gray-300 mb-2" />
              {data.projects.map((pr,i)=>(
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center w-full">
                    <input placeholder="Title" value={pr.title} onChange={e=>handleArray('projects',i,'title',e.target.value)} className="w-2/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring" />
                    <input placeholder="Dates" value={pr.dates} onChange={e=>handleArray('projects',i,'dates',e.target.value)} className="w-1/3 p-2 text-right border border-gray-300 rounded focus:outline-none focus:ring" />
                  </div>
                  {pr.description.map((bullet,bIdx)=>(
                    <div key={bIdx} className="flex items-start space-x-2 mb-2">
                      <span className="text-lg pt-2">•</span>
                      <textarea placeholder="Bullet point" value={bullet} onChange={e=>handleBulletChange('projects',i,bIdx,e.target.value,'description')} rows={2} wrap="soft" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring resize-none whitespace-pre-wrap" />
                      {pr.description.length>1 && <button onClick={()=>removeBullet('projects',i,bIdx,'description')} className="text-red-500">×</button>}
                    </div>
                  ))}
                  <button onClick={()=>addBullet('projects',i,'description')} className="mt-1 px-2 py-1 bg-googleGreen text-white rounded text-xs">Add Bullet</button>
                  {i>0 && <button onClick={()=>removeItem('projects',i)} className="text-red-500">Remove</button>}
                </div>
              ))}
              <button onClick={()=>addItem('projects')} className="mt-2 px-3 py-1 bg-googleGreen text-white rounded">Add Project</button>
            </div>
          </div>
        ) : (
          <div id="resume-preview-wrapper" className="mx-auto" style={{ width: '210mm', height: '297mm', overflow: 'auto', padding: '0.15in 0.2in 0.19in 0.2in', boxSizing: 'border-box' }}>
            <div id="resume-preview" className="bg-white shadow font-sans text-black text-xs" style={{ width: '100%', height: '100%', boxSizing: 'border-box' }}>
              {order.map(sectionKey => {
                switch (sectionKey) {
                  case 'profile':
                    return (
                      <section key="profile" className="">
                        <div className="flex justify-center items-center space-x-2 whitespace-nowrap">
                          <h1 className="text-2xl font-semibold inline-flex items-center space-x-2">
                            <span>{data.name}</span>
                            <span className="controls inline-flex space-x-1">
                              <button disabled={order[0]==='profile'} onClick={()=>moveSection('profile','up')} className="text-sm">↑</button>
                              <button disabled={order[order.length-1]==='profile'} onClick={()=>moveSection('profile','down')} className="text-sm">↓</button>
                            </span>
                          </h1>
                        </div>
                        <div className="contact-info flex flex-nowrap justify-center items-center space-x-1" style={{fontFamily: 'Times New Roman', fontSize: '8.8px'}}>
                          {data.location && <><span>{data.location}</span><span className="mx-1">|</span></>}
                          {data.phone && <><span>{data.phone}</span><span className="mx-1">|</span></>}
                          {data.email && <><a href={`mailto:${data.email}`} target="_blank" rel="noopener noreferrer" title="Ctrl+Click to open link">{data.email}</a><span className="mx-1">|</span></>}
                          {data.linkedin && <><a href={/^(https?:\/\/)/.test(data.linkedin) ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" title="Ctrl+Click to open link">{data.linkedin}</a><span className="mx-1">|</span></>}
                          {data.github && <a href={/^(https?:\/\/)/.test(data.github) ? data.github : `https://${data.github}`} target="_blank" rel="noopener noreferrer" title="Ctrl+Click to open link">{data.github.replace(/^https?:\/\/(www\.)?/i, '')}</a>}
                        </div>
                      </section>
                    );
                  case 'education':
                    return (
                      <section key="education" className="mb-6">
                        <h2 className="text-xl font-semibold uppercase inline-flex items-center space-x-2 mb-2 whitespace-nowrap">
                          <span>Education</span>
                          <span className="controls inline-flex space-x-1">
                            <button disabled={order[0]==='education'} onClick={()=>moveSection('education','up')} className="text-sm">↑</button>
                            <button disabled={order[order.length-1]==='education'} onClick={()=>moveSection('education','down')} className="text-sm">↓</button>
                          </span>
                        </h2>
                        <hr className="border-t border-gray-300 mb-2 mx-4" />
                        {data.education.map((ed, i) => (
                          <div key={i} className="pb-3 mb-3 border-b border-gray-200 last:border-b-0">
                            <div className="flex justify-between items-center w-full mb-2">
                              <span className="font-bold text-sm">{ed.institution}</span>
                              <span className="text-sm text-gray-600">{ed.dates}</span>
                            </div>
                            <div className="flex justify-between items-center w-full mb-3">
                              <span className="text-sm">{ed.degree}</span>
                              <span className="text-sm text-gray-600">{ed.location}</span>
                            </div>
                            {ed.details && (
                              <div className="text-xs">
                                {ed.details.map((bullet, bIdx) => (
                                  <div key={bIdx} style={{ paddingLeft: '1ch', textIndent: '-1ch' }}>• {bullet}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </section>
                    );
                  case 'skills':
                    return (
                      <section key="skills" className="mb-6">
                        <h2 className="text-xl font-semibold uppercase inline-flex items-center space-x-2 mb-2 whitespace-nowrap">
                          <span>Skills</span>
                          <span className="controls inline-flex space-x-1">
                            <button disabled={order[0]==='skills'} onClick={()=>moveSection('skills','up')} className="text-sm">↑</button>
                            <button disabled={order[order.length-1]==='skills'} onClick={()=>moveSection('skills','down')} className="text-sm">↓</button>
                          </span>
                        </h2>
                        <hr className="border-t border-gray-300 mb-2 mx-4" />
                        {data.skills.length > 0 && (
                          <div className="text-xs">
                            {data.skills.map((sk, idx) => (
                              <div key={idx} style={{ paddingLeft: '1ch', textIndent: '-1ch' }}>• {sk.skill}</div>
                            ))}
                          </div>
                        )}
                      </section>
                    );
                  case 'experience':
                    return (
                      <section key="experience" className="mb-6">
                        <h2 className="text-xl font-semibold uppercase inline-flex items-center space-x-2 mb-2 whitespace-nowrap">
                          <span>Experience</span>
                          <span className="controls inline-flex space-x-1">
                            <button disabled={order[0]==='experience'} onClick={()=>moveSection('experience','up')} className="text-sm">↑</button>
                            <button disabled={order[order.length-1]==='experience'} onClick={()=>moveSection('experience','down')} className="text-sm">↓</button>
                          </span>
                        </h2>
                        <hr className="border-t border-gray-300 mb-2 mx-4" />
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
                              <div className="text-xs">
                                {ex.details.map((bullet, bIdx) => (
                                  <div key={bIdx} style={{ paddingLeft: '1ch', textIndent: '-1ch' }}>• {bullet}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </section>
                    );
                  case 'projects':
                    return (
                      <section key="projects" className="mb-6">
                        <h2 className="text-xl font-semibold uppercase inline-flex items-center space-x-2 mb-2 whitespace-nowrap">
                          <span>Projects</span>
                          <span className="controls inline-flex space-x-1">
                            <button disabled={order[0]==='projects'} onClick={()=>moveSection('projects','up')} className="text-sm">↑</button>
                            <button disabled={order[order.length-1]==='projects'} onClick={()=>moveSection('projects','down')} className="text-sm">↓</button>
                          </span>
                        </h2>
                        <hr className="border-t border-gray-300 mb-2 mx-4" />
                        {data.projects.map((pr, i) => (
                          <div key={i} className="pb-3 mb-3 border-b border-gray-200 last:border-b-0">
                            <div className="flex justify-between items-center w-full mb-2">
                              <span className="font-bold text-sm">{pr.title}</span>
                              <span className="text-sm text-gray-600">{pr.dates}</span>
                            </div>
                            {pr.description && (
                              <div className="text-xs">
                                {pr.description.map((bullet, bIdx) => (
                                  <div key={bIdx} style={{ paddingLeft: '1ch', textIndent: '-1ch' }}>• {bullet}</div>
                                ))}
                              </div>
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
    </>
  );
}
