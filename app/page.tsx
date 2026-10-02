"use client";

import React, { useState, useEffect } from 'react';

// Spisak od 119 studenata ekstrahovan sa dostavljene slike
const STUDENTS = [
  "Anja Ajder (2022/0766)", "Vasilije Apostoloski (2022/0679)", "Teodora Adžić (2022/0753)", "Nina Adžić (2022/0954)",
  "Marko Babić (2022/0663)", "Isidora Babić (2022/0938)", "Vanja Bačvanski (2022/0767)", "Tamara Beatović (2022/0650)",
  "Isidora Belić (2022/0898)", "Jana Belčević (2022/0794)", "Ivana Biberdžić (2022/0797)", "Maša Blažić (2022/0620)",
  "Ana Bošković (2022/0754)", "Katarina Bošković (2022/0768)", "Sara Bugarinović (2022/0840)", "Bojana Bulatović (2022/0881)",
  "Aleksandra Vasiljević (2022/0770)", "Dijana Vasić (2022/0744)", "Elena Vasić (2022/0934)", "Mila Veljković (2022/0871)",
  "Dijana Vićentijević (2022/0646)", "Anja Vujaković (2022/0612)", "Milica Vukašinović (2022/0715)", "Lazar Vučetić (2022/0662)",
  "Sara Davidović (2022/0641)", "Ana Dojčinović (2022/0873)", "Nataša Dragić (2022/0718)", "Dejana Drašković (2022/0726)",
  "Rastko Đekić (2022/0644)", "Dejana Đorđević (2022/0649)", "Viktor Đorđević (2022/0665)", "Maša Ždero (2022/0929)",
  "Marija Živanić (2022/0810)", "Milan Zorić (2022/0731)", "Anja Ilić (2022/0849)", "Ognjen Jovanović (2022/0745)",
  "Milica Jovanović (2022/0888)", "Marko Jovanović (2022/0939)", "Milica Joksimović (2022/0629)", "Luka Kalezić (2022/0945)",
  "Anja Kaplarević (2022/0704)", "Marta Kovačević (2022/0622)", "Nina Kovačević (2022/0798)", "Marija Komanović (2022/0692)",
  "Lana Koraksić (2022/0648)", "Isidora Kostić (2022/0690)", "Lazar Kostić (2022/0976)", "Luka Krsmanović (2022/0974)",
  "Anđela Krstić (2022/0967)", "Ksenija Lazarević (2023/1030)", "Anja Lukić (2022/0953)", "Andrea Maletić (2022/0890)",
  "Ksenija Manojlović (2022/0703)", "Ana Maricki (2022/0661)", "Teodora Marjanović (2022/0651)", "Kristina Marković (2022/0747)",
  "Iva Marković (2022/0820)", "Marija Matić (2022/0606)", "Iva Milinković (2022/0655)", "Danijela Milinković (2022/0698)",
  "Maja Milinković (2022/0764)", "Anđela Milovanović (2022/0882)", "Dunja Milosavljević (2022/0601)", "Jelisaveta Milosavljević (2022/0781)",
  "Jovana Milošević (2022/0697)", "Maša Mišurović (2022/0652)", "Minja Mladenović (2022/0891)", "Ema Mlađenović (2022/0786)",
  "Aleksa Mutavdžić (2022/0708)", "Nađa Nešković (2022/0792)", "Miona Nikolić (2022/0839)", "Vanja Obradović (2022/0811)",
  "Natalija Pantić (2022/0608)", "Milica Pantić (2022/0693)", "Maja Pejović (2022/0669)", "Anastasija Petrović (2022/0742)",
  "Marija Petrović (2022/0829)", "Sandra Petrović (2022/0912)", "Andrija Pleskonjić (2022/0971)", "Anja Popović (2022/0674)",
  "Kristina Popčić (2022/0900)", "Damjan Pupović (2022/0670)", "Emilija Pustai (2022/0947)", "Anja Radmilović (2022/0748)",
  "Andrijana Radovanović (2022/0702)", "Mina Radovanović (2023/1031)", "Stevan Ražnatović (2022/0823)", "Luka Savić (2022/0633)",
  "Stevan Savić (2022/0816)", "Teodora Simović (2022/0660)", "Iva Simonović (2022/0699)", "Ana Sićović (2022/0607)",
  "Ana Slamarski (2022/0817)", "Tamara Smiljanić (2022/0678)", "Pavle Smiljanić (2022/0725)", "Teodora Spirovski (2022/0773)",
  "Aleksandra Stanojević (2022/0695)", "Đorđe Stojilković (2023/1028)", "Ana Sulejmanović (2022/0796)", "Milica Tadić (2022/0819)",
  "Filip Todorović (2022/0806)", "Ikonija Todosić (2022/0769)", "Andrea Tomović (2022/0763)", "Tanja Trifunović (2022/0914)",
  "Petar Trumpić (2022/0634)", "Filip Ćirić (2023/1025)", "Ivona Ćitić (2022/0909)", "Una Ćurčić (2022/0975)",
  "Nevena Urošević (2022/0759)", "Nađa Filipović (2022/0878)", "Natalija Fržović (2022/0921)", "Aleksa Čekerevac (2022/0843)",
  "Jovan Čekerevac (2022/0885)", "Katarina Čolanić (2022/0897)", "Ivana Čolić (2022/0771)", "Andreja Čupković (2023/1046)",
  "Mihajlo Šavija (2022/0755)", "Tijana Šarenac (2022/0977)", "Relja Škorić (2022/0986)"
];

export default function Page() {
  const [step, setStep] = useState<"intro" | "vote" | "done">("intro");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [voterId, setVoterId] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let id = localStorage.getItem('voter_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('voter_id', id);
    }
    setVoterId(id);

    if (localStorage.getItem('has_voted') === 'true') {
      setStep("done");
    }
    setLoading(false);
  }, []);

  const handleVote = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateName: selected, voterIdentifier: voterId })
      });

      if (res.ok) {
        localStorage.setItem('has_voted', 'true');
        setStep("done");
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Došlo je do greške.");
        if (res.status === 403) {
          localStorage.setItem('has_voted', 'true');
          setStep("done");
        }
      }
    } catch (error) {
      setErrorMsg("Došlo je do greške na mreži. Pokušaj ponovo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageStyle = { minHeight: '100vh', backgroundColor: '#FAFAFA', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
  const containerStyle = { fontFamily: 'sans-serif', width: '100%', maxWidth: '650px', padding: '35px', backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 8px 24px rgba(14, 78, 140, 0.08)', borderTop: '6px solid #C73A9B' };
  const inputStyle = { width: '100%', padding: '16px', fontSize: '16px', borderRadius: '8px', border: '2px solid #E8CDE8', outlineColor: '#175AA6', marginBottom: '16px', boxSizing: 'border-box' as const, color: '#071B40', transition: 'all 0.2s' };
  const listStyle = { height: '350px', overflowY: 'auto' as const, border: '1px solid #E8CDE8', borderRadius: '8px', backgroundColor: '#FFFFFF', marginBottom: '24px' };
  const itemStyle = (isSelected: boolean) => ({ padding: '14px 16px', cursor: 'pointer', borderBottom: '1px solid #F3F4F6', backgroundColor: isSelected ? '#E8CDE8' : '#FFFFFF', fontWeight: isSelected ? 'bold' : 'normal', color: isSelected ? '#A01B7A' : '#071B40', transition: 'background-color 0.1s' });
  const btnStyle = (disabled: boolean) => ({ width: '100%', padding: '16px', fontSize: '18px', border: 'none', borderRadius: '8px', backgroundColor: disabled ? '#A0B8D0' : '#175AA6', color: '#FFFFFF', cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: 'bold', transition: 'background-color 0.2s', boxShadow: disabled ? 'none' : '0 4px 12px rgba(23, 90, 166, 0.2)' });

  if (loading) return null;

  if (step === "done") {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <img src="/logo1.jpeg" alt="Logo Katedre" style={{ width: '100%', maxWidth: '280px', margin: '0 auto 30px', display: 'block' }} />
          <h1 style={{ color: '#4CB4A3', textAlign: 'center', marginBottom: '20px', fontSize: '26px' }}>✅ Tvoj glas je uspešno zabeležen!</h1>
          <p style={{ textAlign: 'center', color: '#071B40', fontSize: '18px', lineHeight: '1.5' }}>
            Hvala na učešću! Rezultati će biti objavljeni nakon što se glasanje zvanično završi.
          </p>
        </div>
      </div>
    );
  }

  if (step === "intro") {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <img src="/logo1.jpeg" alt="Logo Katedre" style={{ width: '100%', maxWidth: '280px', margin: '0 auto 30px', display: 'block' }} />
          <h1 style={{ color: '#0E4E8C', textAlign: 'center', marginBottom: '25px', fontSize: '28px' }}>Izbor za najboljeg kolegu</h1>
          <div style={{ color: '#071B40', lineHeight: '1.7', marginBottom: '35px', fontSize: '16px' }}>
            <p style={{ marginBottom: '15px' }}>Dragi studenti,</p>
            <p style={{ marginBottom: '15px' }}>
              Pred vama je anketa kojom ćete odlučiti koga iz <b>generacije 2022/2023</b> smatrate najboljim kolegom ili koleginicom. Ova titula ne meri prosek ni uspeh, već nečiju plemenitost tokom studija.  
            </p>
            <p style={{ marginBottom: '15px' }}>
              Dajte svoj glas na osnovu toga ko je od vaših kolega uvek bio tu da pomogne u teškim trenucima, da podeli beleške, da razjasni gradivo onima koji ga nisu razumeli i, najvažnije, ko je bio prijatelj i svojim ponašanjem olakšao i ulepšao put kroz studije. 
            </p>
            <p style={{ marginBottom: '15px' }}>
              Da biste glasali, izaberite studenta iz padajuće liste i kliknite na dugme „Glasaj“. 
            </p>
            <p style={{ marginBottom: '15px' }}>
              Nagradu će dodeliti zajednica studenata modula projektni menadžment – PM Student Hub na događaju PM Generations koji se organizuje uz podršku Katedre za menadžment i upravljanje projektima. Događaj će se održati na Fakultetu organizacionih nauka 21. oktobra 2026. godine. Uskoro više informacija o tome.            </p>
            <p style={{ fontStyle: 'italic', color: '#0E4E8C', fontWeight: '500' }}>
              Kao što kaže Mali princ, samo se srcem dobro vidi, pa neka vas ono vodi kroz ovaj izbor.
            </p>
          </div>
          <button onClick={() => setStep("vote")} style={btnStyle(false)}>
            Započni glasanje
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <img src="/logo1.jpeg" alt="Logo Katedre" style={{ width: '100%', maxWidth: '280px', margin: '0 auto 30px', display: 'block' }} />
        <h1 style={{ color: '#0E4E8C', textAlign: 'center', marginBottom: '10px', fontSize: '28px' }}>Izbor za najboljeg kolegu</h1>
        <p style={{ textAlign: 'center', color: '#5A4A86', marginBottom: '25px' }}>Pronađi kolegu i ostavi svoj glas.</p>

        {errorMsg && <p style={{ color: '#C73A9B', textAlign: 'center', fontWeight: 'bold', marginBottom: '15px', padding: '10px', backgroundColor: '#FAFAFA', borderRadius: '6px' }}>{errorMsg}</p>}

        <input
          type="text"
          placeholder="🔍 Pretraži po imenu ili prezimenu..."
          style={inputStyle}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div style={listStyle}>
          {STUDENTS.filter(s => s.toLowerCase().includes(search.toLowerCase())).map(student => (
            <div
              key={student}
              onClick={() => setSelected(student)}
              style={itemStyle(selected === student)}
            >
              {student}
            </div>
          ))}
          {STUDENTS.filter(s => s.toLowerCase().includes(search.toLowerCase())).length === 0 && <div style={{ padding: '20px', color: '#071B40', textAlign: 'center', fontStyle: 'italic' }}>Nema rezultata za pretragu.</div>}
        </div>

        <button onClick={handleVote} disabled={!selected || isSubmitting} style={btnStyle(!selected || isSubmitting)}>
          {isSubmitting ? `Beleženje glasa...` : (selected ? `Glasaj` : 'Prvo izaberi kolegu')}
        </button>
      </div>
    </div>
  );
}