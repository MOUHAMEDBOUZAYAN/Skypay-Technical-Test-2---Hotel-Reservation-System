import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    nom: '',
    prenom: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ''
  });
  const { register } = useAuth();

  // Validation de l'email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validation de la force du mot de passe
  const checkPasswordStrength = (password) => {
    if (!password) {
      return { score: 0, feedback: '' };
    }

    let score = 0;
    const feedback = [];

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Au moins 8 caractères');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Une lettre minuscule');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Une lettre majuscule');
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Un chiffre');
    }

    if (/[^a-zA-Z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Un caractère spécial');
    }

    let strengthText = '';
    if (score <= 2) {
      strengthText = 'Faible';
    } else if (score === 3) {
      strengthText = 'Moyen';
    } else if (score === 4) {
      strengthText = 'Fort';
    } else {
      strengthText = 'Très fort';
    }

    return {
      score,
      feedback: feedback.length > 0 ? feedback.join(', ') : '',
      strength: strengthText
    };
  };

  // Gérer les changements dans les champs
  const handleFieldChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);

    // Validation de l'email
    if (field === 'email') {
      if (value.length > 0 && !validateEmail(value)) {
        setEmailError('Format d\'email invalide');
      } else {
        setEmailError('');
      }
    }

    // Validation du mot de passe
    if (field === 'password') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }

    // Vérifier si les mots de passe correspondent
    if (field === 'confirmPassword' || field === 'password') {
      const pwd = field === 'password' ? value : updatedData.password;
      const confirmPwd = field === 'confirmPassword' ? value : updatedData.confirmPassword;
      
      if (confirmPwd.length > 0) {
        setPasswordMatch(pwd === confirmPwd);
      } else {
        setPasswordMatch(true);
      }
    }

    setError(''); // Effacer l'erreur précédente
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation de l'email
    if (!validateEmail(formData.email)) {
      setError('Veuillez entrer un email valide');
      return;
    }

    // Validation du mot de passe fort
    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (passwordStrength.score < 3) {
      setError('Le mot de passe est trop faible. Il doit contenir au moins : 8 caractères, une majuscule, une minuscule et un chiffre');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!formData.nom || !formData.prenom) {
      setError('Le nom et le prénom sont requis');
      return;
    }

    setLoading(true);

    try {
      const result = await register(
        formData.email, 
        formData.password, 
        formData.nom, 
        formData.prenom, 
        formData.telephone, 
        formData.role
      );
      if (result.success) {
        setSuccess(result.message || 'Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setTimeout(() => {
          onSwitchToLogin();
        }, 2000);
      } else {
        setError(result.error || 'Erreur d\'inscription');
      }
    } catch (err) {
      setError('Erreur d\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Inscription</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Votre prénom"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email: <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              emailError ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            required
            placeholder="votre@email.com"
          />
          {emailError && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <span className="mr-1">⚠️</span> {emailError}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Numéro de téléphone:
          </label>
          <input
            type="tel"
            value={formData.telephone}
            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+33 6 12 34 56 78"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe: <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleFieldChange('password', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="••••••••"
            minLength="8"
          />
          {formData.password.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Force du mot de passe:</span>
                <span className={`text-xs font-semibold ${
                  passwordStrength.score <= 2 ? 'text-red-600' :
                  passwordStrength.score === 3 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {passwordStrength.strength}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    passwordStrength.score <= 2 ? 'bg-red-500' :
                    passwordStrength.score === 3 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                ></div>
              </div>
              {passwordStrength.feedback && (
                <p className="mt-1 text-xs text-gray-600">
                  <span className="font-medium">Requis:</span> {passwordStrength.feedback}
                </p>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmer le mot de passe:
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              formData.confirmPassword.length > 0
                ? passwordMatch
                  ? 'border-green-300 bg-green-50'
                  : 'border-red-300 bg-red-50'
                : 'border-gray-300'
            }`}
            required
            placeholder="••••••••"
            minLength="8"
          />
          {formData.confirmPassword.length > 0 && !passwordMatch && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <span className="mr-1">❌</span> Les mots de passe ne correspondent pas
            </p>
          )}
          {formData.confirmPassword.length > 0 && passwordMatch && formData.password.length >= 6 && (
            <p className="mt-1 text-sm text-green-600 flex items-center">
              <span className="mr-1">✅</span> Les mots de passe correspondent
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rôle:
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !passwordMatch || formData.password.length < 8 || formData.confirmPassword.length === 0 || passwordStrength.score < 3 || emailError !== '' || !validateEmail(formData.email)}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? 'Inscription...' : 'S\'inscrire'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Déjà un compte ? Se connecter
        </button>
      </div>
    </div>
  );
};

export default Register;

