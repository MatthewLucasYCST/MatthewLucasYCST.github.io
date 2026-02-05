import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class CookieClicker {

    int cookies = 0;
    int cursors = 0;
    int grandmas = 0;

    int cursorCost = 10;
    int grandmaCost = 50;

    JLabel cookieLabel;
    JLabel cpsLabel;

    public CookieClicker() {
        JFrame frame = new JFrame("Cookie Clicker ☕🍪");
        frame.setSize(400, 400);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLayout(new BorderLayout());

        // Top stats
        JPanel statsPanel = new JPanel();
        statsPanel.setLayout(new GridLayout(2, 1));

        cookieLabel = new JLabel("Cookies: 0", SwingConstants.CENTER);
        cpsLabel = new JLabel("Cookies per second: 0", SwingConstants.CENTER);

        statsPanel.add(cookieLabel);
        statsPanel.add(cpsLabel);

        // Cookie button
        JButton cookieButton = new JButton("🍪");
        cookieButton.setFont(new Font("Arial", Font.PLAIN, 60));
        cookieButton.addActionListener(e -> {
            cookies++;
            updateUI();
        });

        // Shop panel
        JPanel shopPanel = new JPanel();
        shopPanel.setLayout(new GridLayout(2, 1));

        JButton cursorButton = new JButton("Buy Cursor (+1 cps) — 10");
        JButton grandmaButton = new JButton("Buy Grandma (+5 cps) — 50");

        cursorButton.addActionListener(e -> {
            if (cookies >= cursorCost) {
                cookies -= cursorCost;
                cursors++;
                cursorCost = (int)(cursorCost * 1.5);
                cursorButton.setText("Buy Cursor (+1 cps) — " + cursorCost);
                updateUI();
            }
        });

        grandmaButton.addActionListener(e -> {
            if (cookies >= grandmaCost) {
                cookies -= grandmaCost;
                grandmas++;
                grandmaCost = (int)(grandmaCost * 1.5);
                grandmaButton.setText("Buy Grandma (+5 cps) — " + grandmaCost);
                updateUI();
            }
        });

        shopPanel.add(cursorButton);
        shopPanel.add(grandmaButton);

        frame.add(statsPanel, BorderLayout.NORTH);
        frame.add(cookieButton, BorderLayout.CENTER);
        frame.add(shopPanel, BorderLayout.SOUTH);

        frame.setVisible(true);

        // Game loop (auto cookies)
        Timer timer = new Timer(1000, e -> {
            cookies += getCPS();
            updateUI();
        });
        timer.start();
    }

    int getCPS() {
        return cursors * 1 + grandmas * 5;
    }

    void updateUI() {
        cookieLabel.setText("Cookies: " + cookies);
        cpsLabel.setText("Cookies per second: " + getCPS());
    }

    public static void main(String[] args) {
        new CookieClicker();
    }
}
