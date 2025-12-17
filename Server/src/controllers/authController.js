import { registerService, loginService, getCurrentUserService } from '../services/authService.js';

export const register = async (req, res) => {
  try {
    const { email, password, nom, prenom, telephone, role } = req.body;

    if (!email || !password || !nom || !prenom) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email, mot de passe, nom et prénom sont requis' 
      });
    }

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Format d\'email invalide' 
      });
    }

    // Validation du mot de passe fort
    if (password.length < 8) {
      return res.status(400).json({ 
        success: false, 
        error: 'Le mot de passe doit contenir au moins 8 caractères' 
      });
    }

    // Vérifier la force du mot de passe
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return res.status(400).json({ 
        success: false, 
        error: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre' 
      });
    }

    const user = await registerService(email, password, nom, prenom, telephone, role || 'user');
    
    res.status(201).json({ 
      success: true, 
      message: 'Utilisateur créé avec succès',
      data: user 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email et mot de passe sont requis' 
      });
    }

    const result = await loginService(email, password);
    
    res.status(200).json({ 
      success: true, 
      message: 'Connexion réussie',
      data: result 
    });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await getCurrentUserService(req.user.id);
    
    res.status(200).json({ 
      success: true, 
      data: user 
    });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

