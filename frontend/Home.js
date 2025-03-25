import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DatabaseIcon from "@mui/icons-material/Storage";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import FeedbackIcon from "@mui/icons-material/Feedback";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import SchoolIcon from "@mui/icons-material/School";
//import VerifiedIcon from "@mui/icons-material/Verified";
//import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

function Home() {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Effet de parallaxe lors du scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroSection = document.getElementById("hero-section");
      if (heroSection) {
        heroSection.style.backgroundPositionY = `${scrollY * 0.5}px`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f8fa" }}>
      {/* Section Héro avec effet parallaxe */}
      <Box
        id="hero-section"
        sx={{
          height: isMobile ? "70vh" : "80vh",
          backgroundImage: "linear-gradient(135deg, #0a4d92 0%, #03a9f4 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        {/* Cercles décoratifs animés */}
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
          sx={{
            position: "absolute",
            width: "40vw",
            height: "40vw",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            top: "-10vw",
            right: "-10vw",
          }}
        />
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2, delay: 0.5 }}
          sx={{
            position: "absolute",
            width: "30vw",
            height: "30vw",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            bottom: "-15vw",
            left: "-10vw",
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant={isMobile ? "h3" : "h2"}
                  sx={{
                    fontWeight: 700,
                    color: "white",
                    textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                    mb: 2,
                  }}
                >
                  Maîtrisez SQL avec Excellence
                </Typography>
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  sx={{
                    color: "rgba(255,255,255,0.85)",
                    mb: 4,
                    fontWeight: 300,
                    textShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  Développez vos compétences en bases de données grâce à notre
                  plateforme d'apprentissage interactive et professionnelle.
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: 2,
                  }}
                >
                  <Button
                    component={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variant="contained"
                    size="large"
                    onClick={() =>
                      accessToken ? navigate("/Login") : navigate("/Profile")
                    }
                    sx={{
                      px: 4,
                      py: 1.5,
                      backgroundColor: "white",
                      color: "#0a4d92",
                      fontWeight: 600,
                      borderRadius: 2,
                      boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.9)",
                      },
                    }}
                    startIcon={<SchoolIcon />}
                  >
                    Commencer Maintenant
                  </Button>
                  <Button
                    component={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variant="outlined"
                    size="large"
                    onClick={() => navigate("/Register")}
                    sx={{
                      px: 4,
                      py: 1.5,
                      color: "white",
                      borderColor: "white",
                      borderRadius: 2,
                      "&:hover": {
                        borderColor: "rgba(255,255,255,0.8)",
                        backgroundColor: "rgba(255,255,255,0.08)",
                      },
                    }}
                  >
                    S'inscrire Gratuitement
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
              }}
            >
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                sx={{
                  width: "100%",
                  maxWidth: 500,
                  height: 350,
                  backgroundColor: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 4,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  p: 3,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "30px",
                    bgcolor: "rgba(0,0,0,0.1)",
                    borderRadius: "4px 4px 0 0",
                    display: "flex",
                    alignItems: "center",
                    px: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    {[
                      { color: "#FF5F56" },
                      { color: "#FFBD2E" },
                      { color: "#27C93F" },
                    ].map((circle, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: circle.color,
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box
                  sx={{
                    mt: 4,
                    color: "white",
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                  }}
                >
                  <Typography
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    sx={{ color: "#61DAFB", fontFamily: "monospace" }}
                  >
                    -- Bienvenue sur la plateforme SQL
                  </Typography>

                  <Typography
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.6 }}
                    sx={{ color: "#E6E6E6", fontFamily: "monospace", mt: 2 }}
                  >
                    SELECT nom, niveau, progression <br />
                    FROM utilisateurs <br />
                    WHERE motivation = 'élevée' <br />
                    ORDER BY progression DESC;
                  </Typography>

                  <Typography
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 0.6 }}
                    sx={{ color: "#6EC566", fontFamily: "monospace", mt: 2 }}
                  >
                    -- Résultat : Votre Succès SQL Garanti !
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Section Fonctionnalités */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Typography
            variant="h4"
            component={motion.h2}
            variants={itemVariants}
            sx={{ fontWeight: 700, textAlign: "center", mb: 1 }}
          >
            Pourquoi choisir notre plateforme ?
          </Typography>
          <Typography
            variant="subtitle1"
            component={motion.p}
            variants={itemVariants}
            sx={{ color: "text.secondary", textAlign: "center", mb: 6 }}
          >
            Des outils puissants pour améliorer vos compétences SQL
          </Typography>

          <Grid container spacing={3}>
            {[
              {
                icon: <AutoGraphIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
                title: "Correction Automatique",
                text: "Notre algorithme d'IA évalue vos requêtes instantanément avec une précision inégalée.",
              },
              {
                icon: <FeedbackIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
                title: "Feedback Personnalisé",
                text: "Recevez des commentaires détaillés pour comprendre vos erreurs et progresser efficacement.",
              },
              {
                icon: <TouchAppIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
                title: "Interface Intuitive",
                text: "Notre éditeur SQL avancé offre une autocomplétion et une mise en forme intelligente.",
              },
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div variants={itemVariants}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 60,
                            height: 60,
                            borderRadius: 2,
                            bgcolor: "rgba(25, 118, 210, 0.08)",
                            mr: 2,
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {feature.title}
                        </Typography>
                      </Box>
                      <Typography
                        color="text.secondary"
                        sx={{ lineHeight: 1.7 }}
                      >
                        {feature.text}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Section Statistiques */}
      <Box
        sx={{
          py: 8,
          background: "linear-gradient(135deg, #0a4d92 0%, #03a9f4 100%)",
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                mb: 6,
                fontWeight: 700,
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              Notre plateforme en chiffres
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              {[
                { number: "10,000+", label: "Utilisateurs" },
                { number: "250+", label: "Exercices" },
                { number: "95%", label: "Taux de satisfaction" },
                { number: "24/7", label: "Support disponible" },
              ].map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Box
                    component={motion.div}
                    whileHover={{ y: -5 }}
                    sx={{
                      textAlign: "center",
                      p: 3,
                      borderRadius: 3,
                      bgcolor: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(10px)",
                      height: "100%",
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.8 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Section Témoignages */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              mb: 2,
              fontWeight: 700,
            }}
          >
            Témoignages
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              textAlign: "center",
              mb: 6,
              color: "text.secondary",
            }}
          >
            Ce que nos utilisateurs disent de nous
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                name: "Thomas D.",
                role: "Étudiant en informatique",
                comment:
                  "Cette plateforme a complètement transformé ma compréhension des bases de données. Les exercices progressifs m'ont permis d'acquérir des compétences solides en SQL.",
              },
              {
                name: "Sophie M.",
                role: "Développeuse Web",
                comment:
                  "Le système de feedback est incroyablement précis. J'ai pu identifier et corriger mes erreurs rapidement, ce qui a accéléré mon apprentissage.",
              },
              {
                name: "Karim B.",
                role: "Data Analyst",
                comment:
                  "Les exercices avancés correspondent parfaitement aux défis réels que je rencontre dans mon travail. Une ressource précieuse pour les professionnels.",
              },
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  component={motion.div}
                  whileHover={{ y: -10 }}
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: 3,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    {[...Array(5)].map((_, i) => (
                      <Box
                        key={i}
                        component="span"
                        sx={{
                          color: "#FFD700",
                          fontSize: 20,
                          mr: 0.5,
                        }}
                      >
                        ★
                      </Box>
                    ))}
                  </Box>
                  <Typography
                    sx={{
                      fontStyle: "italic",
                      mb: 3,
                      flex: 1,
                      color: "text.secondary",
                      lineHeight: 1.7,
                    }}
                  >
                    "{testimonial.comment}"
                  </Typography>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.role}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Section Appel à l'action */}
      <Box
        sx={{
          py: 10,
          background: "linear-gradient(135deg, #0a4d92 0%, #03a9f4 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Cercles décoratifs */}
        <Box
          sx={{
            position: "absolute",
            width: "30vw",
            height: "30vw",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            top: "-15vw",
            left: "-10vw",
          }}
        />

        <Container maxWidth="md">
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            sx={{
              textAlign: "center",
              color: "white",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 3,
                textShadow: "0 2px 10px rgba(0,0,0,0.15)",
              }}
            >
              Prêt à améliorer vos compétences SQL ?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                maxWidth: 700,
                mx: "auto",
                mb: 5,
                fontWeight: 300,
                opacity: 0.9,
              }}
            >
              Rejoignez des milliers d'utilisateurs et commencez votre parcours
              d'apprentissage dès aujourd'hui.
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "center",
                gap: 3,
              }}
            >
              {accessToken ? (
                <></>
              ) : (
                <>
                  <Button
                    component={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/register")}
                    sx={{
                      px: 4,
                      py: 2,
                      backgroundColor: "white",
                      color: "#0a4d92",
                      fontWeight: 600,
                      borderRadius: 2,
                      boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.9)",
                      },
                    }}
                    startIcon={<PersonAddIcon />}
                  >
                    S'inscrire gratuitement
                  </Button>
                  <Button
                    component={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variant="outlined"
                    size="large"
                    onClick={() => navigate("/login")}
                    sx={{
                      px: 4,
                      py: 2,
                      color: "white",
                      borderColor: "white",
                      borderRadius: 2,
                      "&:hover": {
                        borderColor: "rgba(255,255,255,0.8)",
                        backgroundColor: "rgba(255,255,255,0.08)",
                      },
                    }}
                    startIcon={<LoginIcon />}
                  >
                    Se connecter
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 6,
          bgcolor: "#f8fafc",
          borderTop: "1px solid #e0e7ff",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <DatabaseIcon sx={{ fontSize: 30, color: "#1976d2", mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Plateforme SQL
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                La meilleure plateforme pour développer vos compétences en bases
                de données et SQL.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Produit
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                {["Fonctionnalités", "Exercices", "Ressources", "Tarifs"].map(
                  (item, index) => (
                    <Box component="li" key={index} sx={{ mb: 1 }}>
                      <Typography
                        variant="body2"
                        component="a"
                        sx={{
                          color: "text.secondary",
                          textDecoration: "none",
                          "&:hover": { color: "#1976d2" },
                          cursor: "pointer",
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  )
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Société
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                {["À propos", "Blog", "Carrières", "Contact"].map(
                  (item, index) => (
                    <Box component="li" key={index} sx={{ mb: 1 }}>
                      <Typography
                        variant="body2"
                        component="a"
                        sx={{
                          color: "text.secondary",
                          textDecoration: "none",
                          "&:hover": { color: "#1976d2" },
                          cursor: "pointer",
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  )
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Support
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                {["Aide", "Documentation", "FAQ", "Communauté"].map(
                  (item, index) => (
                    <Box component="li" key={index} sx={{ mb: 1 }}>
                      <Typography
                        variant="body2"
                        component="a"
                        sx={{
                          color: "text.secondary",
                          textDecoration: "none",
                          "&:hover": { color: "#1976d2" },
                          cursor: "pointer",
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  )
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Légal
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                {["Confidentialité", "Conditions", "Cookies", "Sécurité"].map(
                  (item, index) => (
                    <Box component="li" key={index} sx={{ mb: 1 }}>
                      <Typography
                        variant="body2"
                        component="a"
                        sx={{
                          color: "text.secondary",
                          textDecoration: "none",
                          "&:hover": { color: "#1976d2" },
                          cursor: "pointer",
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  )
                )}
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Plateforme SQL. Tous droits réservés.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mt: { xs: 2, sm: 0 } }}>
              {["Facebook", "Twitter", "LinkedIn", "Instagram"].map(
                (social, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    component="a"
                    sx={{
                      color: "text.secondary",
                      textDecoration: "none",
                      "&:hover": { color: "#1976d2" },
                      cursor: "pointer",
                    }}
                  >
                    {social}
                  </Typography>
                )
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
